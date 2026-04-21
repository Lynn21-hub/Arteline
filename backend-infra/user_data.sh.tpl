#!/bin/bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive
APP_DIR="/opt/arteline"
BACKEND_DIR="$APP_DIR/backend"
ENV_FILE="$BACKEND_DIR/.env"

apt-get update -y
apt-get install -y ca-certificates curl git unzip jq

curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pm2

if ! command -v aws >/dev/null 2>&1; then
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip"
  unzip -q /tmp/awscliv2.zip -d /tmp
  /tmp/aws/install
fi

rm -rf "$APP_DIR"
git clone --branch "${repository_branch}" --single-branch "${repository_url}" "$APP_DIR"

cd "$BACKEND_DIR"

cat > "$ENV_FILE" <<'ENVEOF'
ENVEOF

aws ssm get-parameters-by-path \
  --region "${aws_region}" \
  --path "${ssm_parameter_path}" \
  --with-decryption \
  --recursive \
  --query "Parameters[*].[Name,Value]" \
  --output text | while read -r name value; do
    key="$${name##*/}"
    printf '%s="%s"\n' "$key" "$value" >> "$ENV_FILE"
  done

npm ci
npx prisma migrate deploy
npx prisma generate

pm2 delete arteline-backend || true
pm2 start server.js --name arteline-backend --update-env
pm2 save
pm2 startup systemd -u root --hp /root

cat >/etc/systemd/system/arteline-healthcheck.service <<'SERVICEEOF'
[Unit]
Description=Arteline backend startup healthcheck
After=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/bin/curl -f http://localhost:${backend_port}/

[Install]
WantedBy=multi-user.target
SERVICEEOF

systemctl daemon-reload
