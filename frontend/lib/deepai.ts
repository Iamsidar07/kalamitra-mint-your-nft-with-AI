import axios from "axios";
import { ethers } from "ethers";
import { toast } from "react-toastify";

export interface MintingState {
  uploading: boolean;
  generatingMetadata: boolean;
  uploadingMetadata: boolean;
  mintingNft: boolean;
}

export const getNftMetadataUri = async ({
  mintFile,
  setStatus,
  setMintingState,
  name,
  description,
}: {
  mintFile: File;
  setStatus: (status: string) => void;
  setMintingState: React.Dispatch<React.SetStateAction<MintingState>>;
  name: string;
  description: string;
}) => {
  if (!mintFile) return;
  const formData = new FormData();
  formData.append("file", mintFile);
  setStatus("Uploading to pinata");
  try {
    // Upload to pinata
    setMintingState((prev) => ({ ...prev, uploading: true }));
    const { ipfsHash } = await uploadToPinata(formData);
    setMintingState((prev) => ({ ...prev, uploading: false }));
    formData.append("ipfsHash", ipfsHash);
    // generateMetadata
    //
    setStatus("Generating nft metadata");
    setMintingState((prev) => ({ ...prev, generatingMetadata: true }));
    const { metadata } = await generateMetadata(formData);
    setMintingState((prev) => ({ ...prev, generatingMetadata: false }));
    // Upload metadata to pinata
    const generatedMetadata = {
      ...metadata,
      name,
      description,
      external_url: "https://assassin-nft.vercel.app/",
    };
    setStatus("Uploading nft metadata to pinata");
    setMintingState((prev) => ({ ...prev, uploadingMetadata: true }));
    const { ipfsHash: metadataIpfsHash } = await uploadMetadata(
      generatedMetadata
    );
    setMintingState((prev) => ({ ...prev, uploadingMetadata: false }));
    const uri = "ipfs://" + metadataIpfsHash;
    return uri;
  } catch (error) {
    console.log(error);
    toast.error("Failed to get metadata uri");
    throw new Error("Failed to get metadata uri");
  }
};

const uploadToPinata = async (formData: FormData) => {
  try {
    const res = await fetch("/api/uploadToIPFS", {
      method: "POST",
      body: formData,
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    toast.error("Failed to upload to pinata.");
    throw new Error("Failed to upload to pinata.");
  }
};

const generateMetadata = async (formData: FormData) => {
  try {
    const res = await fetch("/api/generateMetadata", {
      method: "POST",
      body: formData,
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    toast.error("Failed to generate Metadata");
    throw new Error("Failed to generate Metadata");
  }
};

const uploadMetadata = async (metadata: any) => {
  try {
    const res = await fetch("/api/uploadMetadataToIPFS", {
      method: "POST",
      body: JSON.stringify({ metadata }),
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    toast.error("Failed to upload metadata.");
    throw new Error("Failed to upload metadata.");
  }
};

export const handleGenerateImage = async ({
  prompt,
  modalRef,
  contract,
  setIsImageGenerationLoading,
  setStatus,
  setNft,
}: {
  prompt: string;
  modalRef: React.MutableRefObject<any>;
  contract: ethers.Contract;
  setIsImageGenerationLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setStatus: (status: string) => void;
  setNft: React.Dispatch<React.SetStateAction<File | null>>;
}) => {
  if (!prompt || !modalRef.current) return;
  if (!contract) {
    toast.info("Please connect your metamask.");
    return;
  }
  modalRef.current.showModal();
  setIsImageGenerationLoading(true);
  try {
    const response = await axios.post("/api/generateImage", { prompt });
    if (response.status === 200) {
      setStatus("Your nft is ready to mint");
      const res = await fetch(`data:image/png;base64, ${response.data.image}`);
      const blob = await res.blob();
      const file = new File([blob], "image.png", { type: "image/png" });
      setNft(file);
    } else {
      setStatus(`${response.status}: ${response.data.toString()}`);
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  } finally {
    setIsImageGenerationLoading(false);
  }
};
