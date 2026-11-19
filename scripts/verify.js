import { run } from "hardhat";

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const registryAddress = "0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F";
  
  if (!contractAddress) {
    console.error("Please provide CONTRACT_ADDRESS env variable");
    process.exit(1);
  }

  console.log("Verifying contract at:", contractAddress);
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [registryAddress],
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.error("Verification failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
