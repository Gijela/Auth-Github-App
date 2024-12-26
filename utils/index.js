import fs from "fs";
import jwt from "jsonwebtoken";
import axios from "axios";

export function generateJWT(appId, privateKeyPath) {
  const privateKey = fs.readFileSync(privateKeyPath, "utf8");
  const payload = {
    iat: Math.floor(Date.now() / 1000), // 签发时间
    exp: Math.floor(Date.now() / 1000) + 10 * 60, // 过期时间（10 分钟）
    iss: appId, // GitHub App ID
  };
  console.log("payload", payload);
  const token = jwt.sign(payload, privateKey, { algorithm: "RS256" });
  return token;
}

export async function getInstallations(jwtToken) {
  const installationsUrl = "https://api.github.com/app/installations";
  const headers = {
    Authorization: `Bearer ${jwtToken}`,
    Accept: "application/vnd.github.v3+json",
  };
  try {
    const response = await axios.get(installationsUrl, { headers });
    return response.data;
  } catch (error) {
    console.error("Failed to get installations:", error.response.data);
    return null;
  }
}
