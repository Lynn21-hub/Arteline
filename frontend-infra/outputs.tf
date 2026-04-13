output "amplify_default_domain" {
  value = aws_amplify_app.frontend.default_domain
}

output "frontend_url" {
  value = "https://${var.frontend_branch_name}.${aws_amplify_app.frontend.default_domain}"
}