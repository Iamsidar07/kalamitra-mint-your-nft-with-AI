"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import useWeb3 from "@/components/web3";
import { toast } from "react-toastify";
import Faq from "@/components/Faq";
import { PROMPTS } from "@/constants";
import Footer from "@/components/Footer";
import Features from "@/components/Featuers";
import FormField from "@/components/FormField";
import Hero from "@/components/Hero";
import ExamplePrompts from "@/components/ExamplePrompts";
import Modal from "@/components/Modal";
import { handleMintPressed } from "@/lib/contractInteraction";
import { handleGenerateImage } from "@/lib/deepai";
import Gradients from "@/components/Gradients";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  const {
    contract,
    status,
    setStatus,
    walletAddress,
    price,
    isInsideAllowList,
    currentTokenId,
  } = useWeb3();
  const [prompt, setPrompt] = useState("");
  const [nft, setNft] = useState<File | null>(null);
  const [isImageGenerationLoading, setIsImageGenerationLoading] =
    useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mintingState, setMintingState] = useState({
    uploading: false,
    generatingMetadata: false,
    uploadingMetadata: false,
    mintingNft: false,
  });
  const [mintedNft, setMintedNft] = useState(false);

  const modalRef = useRef<HTMLDialogElement>(null);

  function handleClickOutside(event: any) {
    if (!modalRef.current) return;
    const modalDimensions = modalRef.current?.getBoundingClientRect();
    if (
      (modalDimensions && event.clientX < modalDimensions.left) ||
      event.clientX > modalDimensions.right ||
      event.clientY < modalDimensions.top ||
      event.clientY > modalDimensions.bottom
    ) {
      modalRef.current.close();
      return;
    }
  }

  useEffect(() => {
    if (!modalRef.current) return;
    modalRef.current.addEventListener("click", handleClickOutside);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      modalRef.current?.removeEventListener("click", handleClickOutside);
    };
  }, [modalRef]);

  useEffect(() => {
    if (status) {
      toast.info(status);
    }
  }, [status]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length == 0 || !files) return;
    const file = files[0];
    setNft(file);
    modalRef.current?.showModal();
  };

  const onGenerateImagePressed = async () => {
    if (!contract) {
      toast.info("Please connect your metamask.");
      return;
    }
    await handleGenerateImage({
      setIsImageGenerationLoading,
      setNft,
      setStatus,
      prompt,
      modalRef,
      contract,
    });
  };

  const handleSupriseMe = () => {
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  };

  const onMintPressed = async () => {
    if (!contract || !nft) {
      toast.info("Please connect your metamask.");
      return;
    }
    await handleMintPressed({
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
    });
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center py-24 max-w-7xl mx-auto">
      <Hero />
      <FormField
        handleGenerateImage={onGenerateImagePressed}
        handleImageChange={handleImageChange}
        handleSupriseMe={handleSupriseMe}
        isImageGenerationLoading={isImageGenerationLoading}
        prompt={prompt}
        setPrompt={setPrompt}
      />
      <ExamplePrompts />
      <Features />
      <Faq />
      <Footer />
      <Modal
        isMinting={isMinting}
        transactionHash={transactionHash}
        currentTokenId={currentTokenId}
        isImageGenerationLoading={isImageGenerationLoading}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        mintingState={mintingState}
        modalRef={modalRef}
        onMintPressed={onMintPressed}
        nft={nft}
        mintedNft={mintedNft}
      />
      <Gradients />
    </div>
  );
}
