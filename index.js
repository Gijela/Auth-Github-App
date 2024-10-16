import {
  generateJWT,
  getInstallations,
  getInstallationToken,
  getRepositories,
} from "./utils/index.js";

const appId = 1026724;
const privateKeyPath = "./keys/test-cr-mentor.2024-10-15.private-key.pem";

// 3. 获取 Installation Token

async function main(appId, privateKeyPath) {
  // 1. 使用 github App 私钥文件生成 JWT
  const jwtToken = await generateJWT(appId, privateKeyPath);
  console.log("Generated JWT:", jwtToken);

  // 2. 获取安装信息 Installation ID
  let installationId = "";
  const installations = await getInstallations(jwtToken);
  if (installations) {
    // 提取第一个安装的 installation_id
    installationId = installations[0].id;
    console.log("Installation ID:", installationId);
  }

  // 3. 获取 Installation Token
  const installationToken = await getInstallationToken(
    jwtToken,
    installationId
  );
  console.log("Installation Token:", installationToken);

  // 4. 获取仓库信息
  const repositories = await getRepositories(installationToken);
  console.log("Repositories:", repositories);
}

main(appId, privateKeyPath);
