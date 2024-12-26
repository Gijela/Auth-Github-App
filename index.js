import { generateJWT, getInstallations } from "./utils/index.js";

const appId = 1026724;
const privateKeyPath = "./keys/test-cr-mentor.2024-10-15.private-key.pem";
const githubId = "MDQ6VXNlcjgyMDcxMjA5";

// 3. 获取 Installation Token

async function main(appId, privateKeyPath, githubId) {
  // 1. 使用 github App 私钥文件生成 JWT
  const jwtToken = await generateJWT(appId, privateKeyPath);
  console.log("Generated JWT:", jwtToken);

  // 2. 获取所有安装了 github App 的账号
  const installations = await getInstallations(jwtToken);
  // console.log("🚀 ~ main ~ installations:", installations);
  const { access_tokens_url, account } = installations.find(
    (installation) => installation.account.node_id === githubId
  );
  console.log("access_tokens_url:", access_tokens_url);

  // 3. 获取 githubId 对应用户的 access_tokens
  const response = await fetch(access_tokens_url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  const { token } = await response.json();
  console.log("token:", token);

  // 4. 使用 access_tokens 获取仓库列表
  try {
    const reposResponse = await fetch(account.repos_url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    const repositories = await reposResponse.json();
    console.log("Repositories:", repositories);
  } catch (error) {
    console.error("Failed to fetch repositories:", error);
  }
}

main(appId, privateKeyPath, githubId);
