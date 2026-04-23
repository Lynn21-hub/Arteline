resource "aws_s3_bucket" "arteline_bucket" {
  bucket = "arteline-artworks" 

  tags = {
    Name = "Arteline Bucket"
  }
}

resource "aws_s3_bucket_versioning" "versioning" {
  bucket = aws_s3_bucket.arteline_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "public_access" {
  bucket = aws_s3_bucket.arteline_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "public_read" {
  bucket = aws_s3_bucket.arteline_bucket.id

  policy = jsonencode({
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "AllowLeaRoleToAccessBucket",
			"Effect": "Allow",
			"Principal": {
				"AWS": "arn:aws:iam::848211333656:role/arteline-backend-role"
			},
			"Action": "s3:ListBucket",
			"Resource": "arn:aws:s3:::arteline-artworks"
		},
		{
			"Sid": "PublicReadObjects",
			"Effect": "Allow",
			"Principal": "*",
			"Action": "s3:GetObject",
			"Resource": "arn:aws:s3:::arteline-artworks/*"
		},
		{
			"Sid": "AllowLeaRoleToAccessObjects",
			"Effect": "Allow",
			"Principal": {
				"AWS": "arn:aws:iam::848211333656:role/arteline-backend-role"
			},
			"Action": [
				"s3:GetObject",
				"s3:PutObject",
				"s3:DeleteObject"
			],
			"Resource": "arn:aws:s3:::arteline-artworks/*"
		}
	]
})
}

resource "aws_iam_role" "s3_role" {
  name = "arteline-s3-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "s3_policy" {
  name = "arteline-s3-policy"
  role = aws_iam_role.s3_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject"
        ],
        Resource = "${aws_s3_bucket.arteline_bucket.arn}/*"
      },
      {
        Effect = "Allow",
        Action = "s3:ListBucket",
        Resource = aws_s3_bucket.arteline_bucket.arn
      }
    ]
  })
}

resource "aws_iam_instance_profile" "s3_profile" {
  name = "arteline-s3-profile"
  role = aws_iam_role.s3_role.name
}