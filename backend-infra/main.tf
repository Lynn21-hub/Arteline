data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

locals {
  name_prefix = "${var.project_name}-backend"
  parameter_values = {
    PORT                  = tostring(var.backend_port)
    NODE_ENV              = "production"
    DATABASE_URL          = var.database_url
    DB_HOST               = var.db_host
    DB_USER               = var.db_user
    DB_PASSWORD           = var.db_password
    DB_NAME               = var.db_name
    USER_POOL_ID          = var.user_pool_id
    USER_POOL_CLIENT_ID   = var.user_pool_client_id
    STRIPE_SECRET_KEY     = var.stripe_secret_key
    STRIPE_WEBHOOK_SECRET = var.stripe_webhook_secret
    FRONTEND_URL          = var.frontend_url
    AWS_REGION            = var.aws_app_region
    AWS_S3_REGION         = var.aws_s3_region
    AWS_SES_REGION        = var.aws_ses_region
    AWS_BUCKET_NAME       = var.aws_bucket_name
    SES_FROM_EMAIL        = var.ses_from_email
    ADMIN_SUBS            = var.admin_subs
  }
}

resource "aws_security_group" "backend" {
  name        = "${local.name_prefix}-sg"
  description = "Allow HTTP and SSH access to Arteline backend"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
  }

  ingress {
    description = "Backend API"
    from_port   = var.backend_port
    to_port     = var.backend_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${local.name_prefix}-sg"
  }
}

resource "aws_iam_role" "backend" {
  name = "${local.name_prefix}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "backend" {
  name = "${local.name_prefix}-policy"
  role = aws_iam_role.backend.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:GetParametersByPath"
        ]
        Resource = "arn:aws:ssm:${var.aws_region}:*:parameter${trimsuffix(var.ssm_parameter_path, "/")}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = var.aws_bucket_name == "" ? ["*"] : [
          "arn:aws:s3:::${var.aws_bucket_name}",
          "arn:aws:s3:::${var.aws_bucket_name}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_instance_profile" "backend" {
  name = "${local.name_prefix}-profile"
  role = aws_iam_role.backend.name
}

resource "aws_ssm_parameter" "backend_env" {
  for_each = local.parameter_values

  name      = "${var.ssm_parameter_path}${each.key}"
  type      = "SecureString"
  value     = each.value
  overwrite = true
}

resource "aws_instance" "backend" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.instance_type
  subnet_id                   = data.aws_subnets.default.ids[0]
  vpc_security_group_ids      = [aws_security_group.backend.id]
  key_name                    = var.key_name
  iam_instance_profile        = aws_iam_instance_profile.backend.name
  associate_public_ip_address = true

  user_data = templatefile("${path.module}/user_data.sh.tpl", {
    aws_region         = var.aws_region
    repository_url     = var.repository_url
    repository_branch  = var.repository_branch
    ssm_parameter_path = var.ssm_parameter_path
    backend_port       = var.backend_port
  })

  tags = {
    Name = "${local.name_prefix}-ec2"
  }

  depends_on = [aws_ssm_parameter.backend_env]
}

resource "aws_eip" "backend" {
  domain = "vpc"

  tags = {
    Name = "${local.name_prefix}-eip"
  }
}

resource "aws_eip_association" "backend" {
  instance_id   = aws_instance.backend.id
  allocation_id = aws_eip.backend.id
}

resource "aws_apigatewayv2_api" "backend" {
  name          = "${local.name_prefix}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_headers = ["Content-Type", "Authorization", "stripe-signature"]
    allow_methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    allow_origins = [var.frontend_url]
    max_age       = 300
  }

  tags = {
    Name = "${local.name_prefix}-api"
  }
}

resource "aws_apigatewayv2_integration" "backend_root" {
  api_id                 = aws_apigatewayv2_api.backend.id
  integration_type       = "HTTP_PROXY"
  integration_method     = "ANY"
  integration_uri        = "http://${aws_eip.backend.public_ip}:${var.backend_port}"
  payload_format_version = "1.0"
}

resource "aws_apigatewayv2_integration" "backend_proxy" {
  api_id                 = aws_apigatewayv2_api.backend.id
  integration_type       = "HTTP_PROXY"
  integration_method     = "ANY"
  integration_uri        = "http://${aws_eip.backend.public_ip}:${var.backend_port}/{proxy}"
  payload_format_version = "1.0"
}

resource "aws_apigatewayv2_route" "root" {
  api_id    = aws_apigatewayv2_api.backend.id
  route_key = "ANY /"
  target    = "integrations/${aws_apigatewayv2_integration.backend_root.id}"
}

resource "aws_apigatewayv2_route" "proxy" {
  api_id    = aws_apigatewayv2_api.backend.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.backend_proxy.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.backend.id
  name        = "$default"
  auto_deploy = true

  tags = {
    Name = "${local.name_prefix}-default-stage"
  }
}
