output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.arteline_user_pool.id
}

output "cognito_user_pool_client_id" {
  value = aws_cognito_user_pool_client.arteline_client.id
}


