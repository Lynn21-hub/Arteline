terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_ses_email_identity" "artist_notifications_sender" {
  email = var.ses_sender_email
}

resource "aws_ses_email_identity" "sandbox_recipients" {
  for_each = toset(var.ses_sandbox_recipients)
  email    = each.value
}
