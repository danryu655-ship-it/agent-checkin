import { network } from "hardhat";

async function main() {
  const { ethers } = await network.create();
  
  const registryAddress = "0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F";
  
  const agentCheckin = await ethers.deployContract("AgentCheckin", [registryAddress]);
  
  await agentCheckin.waitForDeployment();
  
  const address = await agentCheckin.getAddress();
  console.log("AgentCheckin deployed to:", address);
  
  const tx = agentCheckin.deploymentTransaction();
  if (tx) {
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed;
    console.log("Gas used:", gasUsed.toString());
    
    const feeData = await ethers.provider.getFeeData();
    const gasPrice = feeData.gasPrice || ethers.parseUnits("3", "gwei");
    const costInWei = gasUsed * gasPrice;
    console.log("Estimated deployment cost in BNB:", ethers.formatEther(costInWei));
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
