"use client";

import { Contract, ethers, formatEther } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";

import { toast } from "react-toastify";
import contractAbi from "../contract-abi.json";
export const CONTRACT_ADDRESS = "0x802C74992CC35006DC5b76287D5245009f58835A";

interface IWeb3Context {
  status: string;
  provider: ethers.BrowserProvider | null;
  setStatus: (status: string) => void;
  walletAddress: string;
  contract: Contract | null;
  isInsideAllowList: boolean;
  price: string;
  connectWalletPressed: () => Promise<void>;
  disconnectWallet: () => void;
  currentTokenId: number;
}

const web3Context = createContext<IWeb3Context>({
  status: "",
  setStatus: () => {},
  walletAddress: "",
  contract: null,
  isInsideAllowList: false,
  price: "",
  connectWalletPressed: () => Promise.resolve(),
  disconnectWallet: () => {},
  currentTokenId: 0,
  provider: null,
});

const useWeb3 = () => {
  const context = useContext(web3Context);
  return context;
};

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [status, setStatus] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [contract, setContract] = useState<Contract | null>(null);
  const [isInsideAllowList, setIsInsideAllowList] = useState(false);
  const [price, setPrice] = useState("");
  const [currentTokenId, setCurrentTokenId] = useState(0);

  async function initializeWeb3() {
    console.log("initializeWeb3");
    if (!window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);
  }

  const handleMintEvent = (
    tokenId: number,
    by: string,
    event: ethers.EventLog,
  ) => {
    console.log(event);
    toast.info(
      `${by.substring(0, 6) + "..." + by.substring(38)} minted #${tokenId}`,
    );
  };

  useEffect(() => {
    initializeWeb3();
  }, []);

  // event listeners
  useEffect(() => {
    if (!contract) return;
    contract.on("NftMinted", handleMintEvent);
    return () => {
      contract.off("NftMinted", handleMintEvent);
    };
  }, [contract]);

  const disconnectWallet = async () => {
    setWalletAddress("");
  };

  const connectWalletPressed = async () => {
    if (!window.ethereum || !provider) {
      setStatus("Please install metamask");
      return;
    }
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    await accountChangeHandler(signer);
  };

  const accountChangeHandler = async (newAccount: ethers.JsonRpcSigner) => {
    if (!provider) return;
    const address = await newAccount.getAddress();
    setWalletAddress(address);
    const signer = await provider.getSigner();
    const contractInstace = new Contract(CONTRACT_ADDRESS, contractAbi, signer);
    setContract(contractInstace);
    const isInAllowList = await contractInstace.allowList(address);
    console.log("isInAllowList", isInAllowList);
    setIsInsideAllowList(isInAllowList);
    setPrice(
      formatEther(
        isInAllowList
          ? await contractInstace.allowListMintNftPrice()
          : await contractInstace.publicMintNftPrice(),
      ),
    );
    setCurrentTokenId(await contractInstace.getCurrentTokeId());
  };

  return (
    <web3Context.Provider
      value={{
        provider,
        status,
        setStatus,
        walletAddress,
        contract,
        isInsideAllowList,
        price,
        connectWalletPressed,
        disconnectWallet,
        currentTokenId,
      }}
    >
      {children}
    </web3Context.Provider>
  );
};

export default useWeb3;
