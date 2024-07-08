import { ethers } from "ethers";
import { MintingState, getNftMetadataUri } from "./deepai";
import { toast } from "react-toastify";

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
  setMintingState: React.Dispatch<React.SetStateAction<MintingState>>;
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
  try {
    const uri = await getNftMetadataUri({
      mintFile: nft,
      setStatus,
      setMintingState,
      name,
      description,
    });

    setMintingState({
      generatingMetadata: true,
      mintingNft: true,
      uploading: true,
      uploadingMetadata: true,
    });

    const tx = isInsideAllowList
      ? await contract.allowListMint(walletAddress, uri, {
          value: ethers.parseEther(price),
        })
      : await contract.publicMint(walletAddress, uri, {
          value: ethers.parseEther(price),
        });
    setTransactionHash(tx.hash);
    await tx.wait();
    setStatus("Wait for transaction to complete " + tx.hash);
    await tx.wait();
    setMintedNft(true);
  } catch (error) {
    console.log("error", error);
    toast.error("Failed to mint your nft");
  } finally {
    setIsMinting(false);
    setMintingState((prev) => ({ ...prev, mintingNft: false }));
  }
};
