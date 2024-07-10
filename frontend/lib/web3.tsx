"use client";

import { Contract, ethers, formatEther } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";

import { toast } from "react-toastify";
import contractAbi from "../contract-abi.json";
import { CONTRACT_ADDRESS } from "@/constants";

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
    const contractInstance = new Contract(
      CONTRACT_ADDRESS,
      contractAbi,
      signer,
    );
    setContract(contractInstance);
    const isInAllowList = await contractInstance.allowList(address);
    setIsInsideAllowList(isInAllowList);
    setPrice(
      formatEther(
        isInAllowList
          ? await contractInstance.allowListMintNftPrice()
          : await contractInstance.publicMintNftPrice(),
      ),
    );
    setCurrentTokenId(await contractInstance.getCurrentTokenId());
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
