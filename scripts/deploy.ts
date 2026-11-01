import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";

const { ethers } = hre;

async function main() {
  console.log("-----------------------------------------");
  console.log("Deploying RepairTag to target network...");

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer account found. Check your private key or network config.");
  }

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer address: ${deployer.address}`);
  console.log(`Deployer balance: ${ethers.formatEther(balance)} BOHR`);

  const RepairTag = await ethers.getContractFactory("RepairTag");
  const repairTag = await RepairTag.deploy();
  await repairTag.waitForDeployment();

  const address = await repairTag.getAddress();
  console.log(`RepairTag successfully deployed at: ${address}`);
  console.log("-----------------------------------------");

  // Save to lib/deployment.json
  const deploymentInfo = {
    address,
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    deployedAt: new Date().toISOString(),
  };

  const deploymentPath = path.join(process.cwd(), "lib", "deployment.json");
  fs.mkdirSync(path.dirname(deploymentPath), { recursive: true });
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`Saved deployment info to: ${deploymentPath}`);

  // Update .env with NEXT_PUBLIC_CONTRACT_ADDRESS
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf-8");
    if (envContent.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${address}\n`;
    }
    fs.writeFileSync(envPath, envContent);
    console.log(`Updated NEXT_PUBLIC_CONTRACT_ADDRESS in .env`);
  }
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
