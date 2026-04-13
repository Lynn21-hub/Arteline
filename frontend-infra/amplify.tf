resource "aws_amplify_app" "frontend" {
  name         = var.frontend_app_name
  repository   = var.frontend_repository_url
  access_token = var.github_token
  platform     = "WEB"

  environment_variables = {
    REACT_APP_API_URL = var.frontend_api_url
  }

  build_spec = <<-EOT
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend/my-app
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: frontend/my-app/build
    files:
      - '**/*'
  cache:
    paths:
      - frontend/my-app/node_modules/**/*
EOT

  custom_rule {
    source = "</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>"
    target = "/index.html"
    status = "200"
  }
}

resource "aws_amplify_branch" "main" {
  app_id            = aws_amplify_app.frontend.id
  branch_name       = var.frontend_branch_name
  stage             = "PRODUCTION"
  enable_auto_build = true

  environment_variables = {
    REACT_APP_API_URL = var.frontend_api_url
  }
}