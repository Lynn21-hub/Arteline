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

resource "aws_cognito_user_pool" "arteline_user_pool" {
    name="arteline-user-pool"

    username_attributes = ["email"]

    auto_verified_attributes = ["email"]

    password_policy{
        minimum_length = 8
        require_lowercase = true
        require_uppercase = true
        require_numbers = true
        require_symbols = true
    }
    schema {
        name = "email"
        attribute_data_type = "String"
        required = true 
        mutable = false
    }

}

resource "aws_cognito_user_pool_client" "arteline_client" {
    name = "arteline-client"

    user_pool_id = aws_cognito_user_pool.arteline_user_pool.id

    generate_secret = false 

    explicit_auth_flows = [
        "ALLOW_USER_PASSWORD_AUTH", 
        "ALLOW_USER_SRP_AUTH",
        "ALLOW_REFRESH_TOKEN_AUTH"
    ]
  
}

