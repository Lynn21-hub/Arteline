output "backend_public_ip" {
  value = aws_eip.backend.public_ip
}

output "backend_api_url" {
  value = "http://${aws_eip.backend.public_ip}:${var.backend_port}"
}

output "backend_https_api_url" {
  value = aws_apigatewayv2_api.backend.api_endpoint
}

output "stripe_webhook_url" {
  value = "http://${aws_eip.backend.public_ip}:${var.backend_port}/webhook/stripe"
}

output "stripe_https_webhook_url" {
  value = "${aws_apigatewayv2_api.backend.api_endpoint}/webhook/stripe"
}

output "ssh_command" {
  value = "ssh ubuntu@${aws_eip.backend.public_ip}"
}
