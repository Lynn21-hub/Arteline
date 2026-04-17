const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
	region: process.env.AWS_S3_REGION || process.env.AWS_REGION,
	credentials:
		process.env.AWS_S3_ACCESS_KEY_ID && process.env.AWS_S3_SECRET_ACCESS_KEY
			? {
					accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
					secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
				}
			: undefined,
});

module.exports = s3;