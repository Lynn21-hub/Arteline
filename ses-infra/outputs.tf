output "ses_sender_email" {
  value       = aws_ses_email_identity.artist_notifications_sender.email
  description = "The verified SES sender email identity"
}

output "ses_sender_email_arn" {
  value       = aws_ses_email_identity.artist_notifications_sender.arn
  description = "ARN of the SES email identity"
}
