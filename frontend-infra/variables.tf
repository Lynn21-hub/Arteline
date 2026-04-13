
variable "frontend_app_name" {
  type        = string
  description = "Amplify app name for frontend"
  default     = "arteline-frontend"
}

variable "frontend_repository_url" {
  type        = string
  description = "GitHub repository URL for the frontend project"
}

variable "github_token" {
  type        = string
  description = "GitHub personal access token for Amplify"
  sensitive   = true
}

variable "frontend_branch_name" {
  type        = string
  description = "Git branch to deploy"
  default     = "main"
}

variable "frontend_api_url" {
  type        = string
  description = "Backend API base URL used by the frontend"
}