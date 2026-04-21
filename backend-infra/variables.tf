variable "aws_region" {
  type        = string
  description = "AWS region for backend infrastructure"
  default     = "eu-west-1"
}

variable "project_name" {
  type        = string
  description = "Name prefix for backend resources"
  default     = "arteline"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type for the backend"
  default     = "t3.micro"
}

variable "key_name" {
  type        = string
  description = "Existing EC2 key pair name for SSH access"
}

variable "allowed_ssh_cidr" {
  type        = string
  description = "CIDR allowed to SSH into the backend instance. Use your public IP with /32."
}

variable "repository_url" {
  type        = string
  description = "GitHub repository URL to deploy on EC2"
  default     = "https://github.com/Lynn21-hub/Arteline.git"
}

variable "repository_branch" {
  type        = string
  description = "Git branch to deploy on EC2"
  default     = "real-data"
}

variable "backend_port" {
  type        = number
  description = "Port Express listens on"
  default     = 5001
}

variable "ssm_parameter_path" {
  type        = string
  description = "SSM Parameter Store path containing backend env vars"
  default     = "/arteline/backend/"
}

variable "frontend_url" {
  type        = string
  description = "Amplify frontend URL used for Stripe success/cancel redirects"
}

variable "database_url" {
  type        = string
  description = "Prisma DATABASE_URL"
  sensitive   = true
}

variable "db_host" {
  type        = string
  description = "RDS host for mysql2 connection"
}

variable "db_user" {
  type        = string
  description = "RDS username"
  sensitive   = true
}

variable "db_password" {
  type        = string
  description = "RDS password"
  sensitive   = true
}

variable "db_name" {
  type        = string
  description = "RDS database name"
  default     = "arteline"
}

variable "user_pool_id" {
  type        = string
  description = "Cognito User Pool ID"
}

variable "user_pool_client_id" {
  type        = string
  description = "Cognito User Pool Client ID"
}

variable "stripe_secret_key" {
  type        = string
  description = "Stripe secret key"
  sensitive   = true
}

variable "stripe_webhook_secret" {
  type        = string
  description = "Stripe webhook signing secret for the deployed endpoint"
  sensitive   = true
}

variable "aws_bucket_name" {
  type        = string
  description = "S3 bucket name for artwork uploads"
  default     = ""
}

variable "aws_app_region" {
  type        = string
  description = "Default AWS SDK region used by the backend"
  default     = "us-east-1"
}

variable "aws_s3_region" {
  type        = string
  description = "S3 bucket region"
  default     = "us-east-1"
}

variable "aws_ses_region" {
  type        = string
  description = "SES region"
  default     = "us-east-1"
}

variable "ses_from_email" {
  type        = string
  description = "Verified SES sender email. Leave empty to skip emails."
  default     = ""
}

variable "admin_subs" {
  type        = string
  description = "Comma-separated Cognito sub values for admins"
  default     = ""
}
