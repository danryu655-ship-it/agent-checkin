import { defineConfig } from "hardhat/config";
import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import hardhatVerify from "@nomicfoundation/hardhat-verify";

export default defineConfig({
  plugins: [
    hardhatToolboxMochaEthers,
    hardhatVerify
  ],
  solidity: "0.8.27",
  networks: {
    bsc: {
      type: "http",
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
    }
  },
  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY,
  }
});
