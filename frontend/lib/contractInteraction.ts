import { ethers } from "ethers";
import { getNftMetadataUri } from "./deepai";
import { toast } from "react-toastify";
import { IMintingState } from "@/app/page";

export const handleMintPressed = async ({
  contract,
  nft,
  setMintingState,
  setIsMinting,
  setStatus,
  setTransactionHash,
  walletAddress,
  price,
  isInsideAllowList,
  setMintedNft,
  name,
  description,
}: {
  contract: ethers.Contract;
  nft: File;
  setMintingState: React.Dispatch<React.SetStateAction<IMintingState>>;
  setIsMinting: React.Dispatch<React.SetStateAction<boolean>>;
  setStatus: (status: string) => void;
  setTransactionHash: React.Dispatch<React.SetStateAction<string>>;
  walletAddress: string;
  price: string;
  isInsideAllowList: boolean;
  setMintedNft: React.Dispatch<React.SetStateAction<boolean>>;
  name: string;
  description: string;
}) => {
  setIsMinting(true);
  setMintingState({
    generatingMetadata: true,
    mintingNft: true,
    uploading: true,
    uploadingMetadata: true,
    importingNft: true,
  });
  try {
    const uri = await getNftMetadataUri({
      mintFile: nft,
      setStatus,
      setMintingState,
      name,
      description,
    });

    const tx = isInsideAllowList
      ? await contract.allowListMint(walletAddress, uri, {
          value: ethers.parseEther(price),
        })
      : await contract.publicMint(walletAddress, uri, {
          value: ethers.parseEther(price),
        });

    setStatus("Wait for transaction to complete " + tx.hash);
    const receipt = await tx.wait();
    setTransactionHash(receipt.hash);
    setMintedNft(true);
  } catch (error) {
    console.log("error", error);
    toast.error("Failed to mint your nft");
  }
};
