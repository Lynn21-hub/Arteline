# Arteline Backend Infrastructure

This Terraform folder deploys the Express backend to EC2.

It creates:

- EC2 instance running Ubuntu
- Elastic IP
- Security group for SSH, HTTP, and backend port `5001`
- IAM role for SSM Parameter Store, Bedrock, SES, and S3 access
- SSM SecureString parameters for backend environment variables
- EC2 user-data that clones the repo, installs dependencies, runs Prisma migrations, and starts the backend with PM2

## Usage

Copy the example variables file:

```bash
cp terraform.tfvars.example terraform.tfvars
```

Fill in real values in `terraform.tfvars`. Do not commit that file.

Deploy:

```bash
terraform init
terraform plan
terraform apply
```

After apply, Terraform outputs:

- `backend_api_url`
- `backend_https_api_url`
- `stripe_webhook_url`
- `stripe_https_webhook_url`
- `ssh_command`

Use `backend_https_api_url` as the frontend `REACT_APP_API_URL`. This avoids browser mixed-content blocking because Amplify is served over HTTPS.

If you manage Amplify with `frontend-infra`, update it with:

```bash
cd ../frontend-infra
terraform apply -var='frontend_api_url=https://API_GATEWAY_ID.execute-api.eu-west-1.amazonaws.com'
```

Use `stripe_https_webhook_url` in the Stripe Dashboard webhook endpoint and listen for:

```text
checkout.session.completed
```

## Notes

This version exposes EC2 port `5001` and also creates an HTTPS API Gateway proxy for Amplify and Stripe. For a more polished production setup later, add a custom domain such as `https://api.arteline.com`.
