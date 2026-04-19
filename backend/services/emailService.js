const sendArtistApprovedEmail = async ({ toEmail, displayName }) => {
  if (!toEmail) {
    return { sent: false, reason: "missing-recipient" };
  }

  const fromEmail = process.env.SES_FROM_EMAIL;
  if (!fromEmail) {
    console.warn("SES_FROM_EMAIL is not configured. Skipping approval email.");
    return { sent: false, reason: "missing-from-email" };
  }

  let SESClient;
  let SendEmailCommand;

  try {
    ({ SESClient, SendEmailCommand } = require("@aws-sdk/client-ses"));
  } catch (error) {
    console.warn("@aws-sdk/client-ses is not installed. Skipping approval email.");
    return { sent: false, reason: "missing-ses-sdk" };
  }

  const region = process.env.AWS_SES_REGION || "us-east-1";
  const clientConfig = { region };

  // Use dedicated SES credentials if provided, otherwise fall back to default credentials
  if (process.env.AWS_SES_ACCESS_KEY_ID && process.env.AWS_SES_SECRET_ACCESS_KEY) {
    clientConfig.credentials = {
      accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
    };
  }

  const client = new SESClient(clientConfig);

  const safeName = displayName || "Artist";
  const subject = "Your Arteline artist application was approved";
  const textBody = `Hi ${safeName},\n\nYour artist application on Arteline has been approved. You can now publish artworks and access your artist dashboard.\n\nBest,\nArteline Team`;
  const htmlBody = `<p>Hi ${safeName},</p><p>Your artist application on <strong>Arteline</strong> has been approved.</p><p>You can now publish artworks and access your artist dashboard.</p><p>Best,<br/>Arteline Team</p>`;

  try {
    await client.send(
      new SendEmailCommand({
        Source: fromEmail,
        Destination: { ToAddresses: [toEmail] },
        Message: {
          Subject: { Data: subject },
          Body: {
            Text: { Data: textBody },
            Html: { Data: htmlBody },
          },
        },
      })
    );

    return { sent: true };
  } catch (error) {
    console.error("Failed to send artist approval email:", error);
    return { sent: false, reason: "send-failed", error: error.message };
  }
};

module.exports = {
  sendArtistApprovedEmail,
};
