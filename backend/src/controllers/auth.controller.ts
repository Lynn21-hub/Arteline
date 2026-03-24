import { Request, Response } from "express";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});




export const signup = async (req: Request, res: Response) => {
   const CLIENT_ID = process.env.COGNITO_CLIENT_ID;

  console.log("SIGNUP CLIENT_ID:", CLIENT_ID); // 👈 DEBUG

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    const command = new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
      ],
    });

    await client.send(command);

    return res.json({
      message: "Signup successful. Check your email.",
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
   const CLIENT_ID = process.env.COGNITO_CLIENT_ID;

  console.log("LOGIN CLIENT_ID:", CLIENT_ID); // 👈 DEBUG
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  try {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const response = await client.send(command);

    const tokens = response.AuthenticationResult;

    return res.json({
      access_token: tokens?.AccessToken,
      id_token: tokens?.IdToken,
      refresh_token: tokens?.RefreshToken,
    });
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }
};

export const confirmSignup = async (req: Request, res: Response) => {
  const CLIENT_ID = process.env.COGNITO_CLIENT_ID;

  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Missing email or code" });
  }

  try {
    const command = new ConfirmSignUpCommand({
      ClientId: CLIENT_ID!,
      Username: email,
      ConfirmationCode: code,
    });

    await client.send(command);

    return res.json({
      message: "User confirmed successfully",
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};