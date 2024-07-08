import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { vars } from "hardhat/config";
import dotenv from "dotenv";
dotenv.config();

const url = vars.get("ALCHEMY_RPC_URL");
const key = vars.get("ETHERSCAN_API_KEY");
const privateKey = vars.get("SEPOLIA_PRIVATE_KEY");
const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: url,
      accounts: [privateKey],
    },
  },
  etherscan: {
    apiKey: key,
  },
};

export default config;
