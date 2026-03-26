const { CognitoJwtVerifier } = require("aws-jwt-verify");

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.COGNITO_CLIENT_ID,
});

const verifyCognitoToken = async (req, res, next) => {
  try {
    console.log("=== AUTH MIDDLEWARE HIT ===");

    const authHeader = req.headers.authorization;
    console.log("AUTH HEADER:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Missing or invalid Authorization header",
      });
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifier.verify(token);

    console.log("TOKEN VERIFIED:", payload);

    req.user = payload;
    next();
  } catch (error) {
    console.log("AUTH ERROR:", error);
    return res.status(401).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

module.exports = verifyCognitoToken;