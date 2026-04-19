variable "aws_region" {
  type        = string
  description = "AWS region where SES identity is created"
  default     = "us-east-1"
}

variable "ses_sender_email" {
  type        = string
  description = "Verified SES sender email used for artist approval notifications"
  default     = "lhammoud2005@gmail.com"
}

variable "ses_sandbox_recipients" {
  type        = list(string)
  description = "List of recipient emails to verify in SES sandbox environment"
  default     = [
    "line1998hammoud@gmail.com"
  ]
}
