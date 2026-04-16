const { CognitoJwtVerifier } = require("aws-jwt-verify");

const idTokenVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID,
  tokenUse: "id",
  clientId: process.env.USER_POOL_CLIENT_ID,
});

const accessTokenVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.USER_POOL_CLIENT_ID,
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
    let payload;

    try {
      payload = await idTokenVerifier.verify(token);
    } catch (idTokenError) {
      payload = await accessTokenVerifier.verify(token);
    }

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
