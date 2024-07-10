import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AssassinModule = buildModule("AssassinModule", (m) => {
  const allowlist = m.getParameter("allowlist", [
    "0xb4D6ef628Bad31c0e711f5c6909F03Aa9774F79c",
  ]);
  const assassinNft = m.contract("AssassinNFT", [allowlist]);

  return { assassinNft };
});

export default AssassinModule;
