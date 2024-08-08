"use client";
import { MINTING_STATES } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GoLinkExternal } from "react-icons/go";
import { IoCheckmarkDone } from "react-icons/io5";
import { LuLoader2 } from "react-icons/lu";
import { toast } from "react-toastify";
import { useWindowSize } from "react-use";
import Button from "./Button";
import { CONTRACT_ADDRESS } from "@/constants";
import { MdGraphicEq } from "react-icons/md";

interface MintingState {
  uploading: boolean;
  generatingMetadata: boolean;
  uploadingMetadata: boolean;
  mintingNft: boolean;
}

interface ModalProps {
  isMinting: boolean;
  transactionHash: string;
  currentTokenId: number;
  isImageGenerationLoading: boolean;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  mintingState: MintingState;
  modalRef: React.RefObject<HTMLDialogElement>;
  onMintPressed: () => void;
  nft: File | null;
  mintedNft: boolean;
}

const Modal = ({
  currentTokenId,
  description,
  isImageGenerationLoading,
  isMinting,
  modalRef,
  mintingState,
  name,
  onMintPressed,
  setDescription,
  setName,
  transactionHash,
  mintedNft,
  nft,
}: ModalProps) => {
  const [imageSrc, setImageSrc] = useState("");
  useEffect(() => {
    if (nft) {
      const objectUrl = URL.createObjectURL(nft);
      setImageSrc(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [nft]);
  return (
    <dialog
      ref={modalRef}
      className={cn(
        "w-full bg-gray-950 max-w-5xl mx-auto rounded-2xl backdrop:bg-gray-950/70 ring-1 ring-gray-900/70"
      )}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-gray-900/70">
        <div className="w-full h-full grid place-items-center">
          {nft ? (
            <Image
              src={imageSrc}
              alt="nft"
              width={1024}
              height={1024}
              quality={100}
              className="object-cover rounded-tl-2xl rounded-bl-2xl"
            />
          ) : isImageGenerationLoading ? (
            <div className="flex flex-col items-center justify-center mx-auto text-zinc-600">
              <LuLoader2 className="animate-spin text-3xl " />
              <p className="font-mono">Generating your cute nft...</p>
            </div>
          ) : null}
        </div>
        <div className="gap-4 p-4 text-white filter backdrop-blur flex flex-col relative overflow-hidden">
          <div
            className={cn(
              "p-5 flex flex-col absolute bottom-0 inset-x-0 bg-gray-950  filter translate-y-[110%] overflow-hidden h-full rounded-t-2xl z-50 transition-transform gap-2",
              {
                "translate-y-0": isMinting || mintedNft,
              }
            )}
          >
            {MINTING_STATES.map(({ text, id }, i) => (
              <div
                key={id}
                className="flex items-center gap-2 text-zinc-500 p-4 ring-1 ring-gray-900"
              >
                {mintingState[id as keyof typeof mintingState] && !mintedNft ? (
                  <LuLoader2 className="animate-spin" />
                ) : mintedNft ? (
                  <IoCheckmarkDone className="text-teal-500" />
                ) : (
                  <MdGraphicEq className="text-gray-700" />
                )}
                <p>{text}</p>
              </div>
            ))}
            {transactionHash ? (
              <div className="text-sm text-zinc-500 mt-12 space-y-4 w-full">
                <p
                  className="font-bold cursor-pointer text-center"
                  onClick={() => {
                    navigator.clipboard.writeText(transactionHash);
                    toast.success("Copied to clipboard");
                  }}
                >
                  <span className="font-mono text-zinc-500/60">Hash</span>{" "}
                  {transactionHash.substring(0, 12)}...
                  {transactionHash.substring(50)}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <a
                    href={`https://sepolia.etherscan.io/search?f=0&q=${transactionHash}`}
                    target="_blank"
                    className="bg-white ring-zinc-900 ring-1 rounded-md px-4 py-3.5 w-full flex items-center gap-2 justify-center hover:brightness-125"
                  >
                    <GoLinkExternal className="text-zinc-500 w-5 h-5" />
                    view on etherscan
                  </a>
                  <a
                    href={`https://testnets.opensea.io/assets/sepolia/${CONTRACT_ADDRESS}/${currentTokenId}`}
                    target="_blank"
                    className=" ring-gray-800 ring-1 rounded-md px-4 py-3.5 w-full flex items-center gap-2 justify-center hover:brightness-125"
                  >
                    <Image
                      src="/opensea.png"
                      alt="opensea"
                      width={20}
                      height={20}
                    />
                    view on Opensea
                  </a>
                </div>
              </div>
            ) : null}
          </div>

          {isMinting ? (
            <div className="absolute inset-0 bg-gray-900/35 blur-[17rem]"></div>
          ) : (
            <>
              <input
                placeholder="Cyber Kangaroo"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  e.stopPropagation();
                }}
                className="px-4 py-3 ring-1 ring-gray-900/70 bg-transparent w-full rounded-xl outline-none focus-within:brightness-110"
              />
              <textarea
                placeholder="Description of your nft"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  e.stopPropagation();
                }}
                className="resize-none flex-1 px-4 py-3 ring-1 ring-gray-900/70 bg-transparent w-full rounded-xl outline-none focus-within:brightness-110"
                rows={8}
              />
              <Button
                onClick={onMintPressed}
                disabled={!nft}
                className={cn("bg-white w-full bg-opacity-100 text-black", {
                  hidden: isMinting,
                })}
              >
                Mint
              </Button>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
