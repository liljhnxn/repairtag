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

  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);
  const symbol = chainId === 677 ? "BOT" : "BOHR";
  const explorerUrl = chainId === 677 ? "https://scan.botchain.ai" : "https://scan.bohr.life";

  const balance = await ethers.provider.getBalance(deployer.address);
  const feeData = await ethers.provider.getFeeData();

  console.log(`Network: ${network.name} (Chain ID: ${chainId})`);
  console.log(`Deployer address: ${deployer.address}`);
  console.log(`Deployer balance: ${ethers.formatEther(balance)} ${symbol}`);
  if (feeData.gasPrice) {
    console.log(`Current Gas Price: ${ethers.formatUnits(feeData.gasPrice, "gwei")} gwei`);
  }

  // Deploy with optimized gas
  const RepairTag = await ethers.getContractFactory("RepairTag");
  const repairTag = await RepairTag.deploy();
  await repairTag.waitForDeployment();

  const address = await repairTag.getAddress();
  const txReceipt = await repairTag.deploymentTransaction()?.wait();
  const gasUsed = txReceipt?.gasUsed ? txReceipt.gasUsed.toString() : "N/A";
  const effectiveGasPrice = txReceipt?.gasPrice ? ethers.formatUnits(txReceipt.gasPrice, "gwei") : "N/A";
  const totalCost = txReceipt?.gasUsed && txReceipt?.gasPrice
    ? ethers.formatEther(txReceipt.gasUsed * txReceipt.gasPrice)
    : "N/A";

  console.log("-----------------------------------------");
  console.log(`RepairTag successfully deployed at: ${address}`);
  console.log(`Gas used: ${gasUsed} units (~${totalCost} ${symbol} at ${effectiveGasPrice} gwei)`);
  console.log(`Block Explorer: ${explorerUrl}/address/${address}`);
  console.log("-----------------------------------------");

  // Save to lib/deployment.json
  const deploymentInfo = {
    address,
    network: chainId === 677 ? "botchainMainnet" : "botchain",
    chainId,
    deployedAt: new Date().toISOString(),
    explorer: `${explorerUrl}/address/${address}`,
  };

  const deploymentPath = path.join(process.cwd(), "lib", "deployment.json");
  fs.mkdirSync(path.dirname(deploymentPath), { recursive: true });
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`Saved deployment info to: ${deploymentPath}`);

  // Update .env with NEXT_PUBLIC_CONTRACT_ADDRESS & mainnet endpoints if chain is 677
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf-8");

    // Update contract address
    if (envContent.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${address}\n`;
    }

    // If deploying to Mainnet (677), update the network config in .env as well
    if (chainId === 677) {
      envContent = envContent.replace(/BOTCHAIN_RPC_URL=.*/, `BOTCHAIN_RPC_URL=https://rpc.botchain.ai`);
      envContent = envContent.replace(/NEXT_PUBLIC_BOTCHAIN_RPC_URL=.*/, `NEXT_PUBLIC_BOTCHAIN_RPC_URL=https://rpc.botchain.ai`);
      envContent = envContent.replace(/NEXT_PUBLIC_BOTCHAIN_CHAIN_ID=.*/, `NEXT_PUBLIC_BOTCHAIN_CHAIN_ID=677`);
      envContent = envContent.replace(/NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL=.*/, `NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL=https://scan.botchain.ai`);
    }

    fs.writeFileSync(envPath, envContent);
    console.log(`Updated .env with mainnet contract address and configuration`);
  }
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
