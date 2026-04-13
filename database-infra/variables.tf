variable "db_username" {
  type        = string
  description = "Master username for RDS"
  sensitive   = true
}

variable "db_password" {
  type        = string
  description = "Master password for RDS"
  sensitive   = true
}

variable "db_name" {
  type        = string
  description = "Initial database name"
  default     = "arteline"
}
