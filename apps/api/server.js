import http from "node:http";
import client from "./openai-client.js";

const PORT = process.env.PORT || 3000;

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

async function parseBody(req) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
  }
  return JSON.parse(body || "{}");
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  if (req.method !== "POST" || req.url !== "/analyze") {
    sendJson(res, 404, { error: "Endpoint not found" });
    return;
  }

  let payload;
  try {
    payload = await parseBody(req);
  } catch (error) {
    sendJson(res, 400, { error: "Invalid JSON body" });
    return;
  }

  const { text } = payload;
  if (!text || typeof text !== "string") {
    sendJson(res, 400, { error: "Request body must include a text field" });
    return;
  }

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: text,
    });

    const result = Array.isArray(response.output)
      ? response.output
          .map((item) =>
            Array.isArray(item.content)
              ? item.content.map((block) => block.text ?? "").join("")
              : ""
          )
          .join("\n")
      : "";

    sendJson(res, 200, { result, raw: response });
  } catch (error) {
    console.error("OpenAI request failed:", error);
    sendJson(res, 500, {
      error: "OpenAI request failed",
      details: error.message,
    });
  }
});

server.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
