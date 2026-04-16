const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({
  region: "us-east-1",
});

async function getSearchIntent(query) {
  const prompt = `
You are an assistant for an art marketplace.

User query: "${query}"

Extract:
- keywords (array)
- category (if any)

Return ONLY valid JSON:
{
  "keywords": [],
  "category": ""
}
`;

  const body = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 200,
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  };

  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(body),
  });

  const response = await client.send(command);

  const decoded = JSON.parse(new TextDecoder().decode(response.body));

  const text = decoded.content[0].text;

  return JSON.parse(text);
}

module.exports = { getSearchIntent };