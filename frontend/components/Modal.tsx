"use client";
import React from "react";
import Confetti from "react-confetti";
import Button from "./Button";
import Image from "next/image";
import { GoLinkExternal } from "react-icons/go";
import { toast } from "react-toastify";
import { LuLoader2 } from "react-icons/lu";
import { IoCheckmarkDone } from "react-icons/io5";
import { MINTING_STATES } from "@/constants";
import { cn } from "@/lib/utils";
import { useWindowSize } from "react-use";
import { CONTRACT_ADDRESS } from "./web3";

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
  const { width, height } = useWindowSize();
  return (
    <dialog
      ref={modalRef}
      className={cn(
        "w-full bg-zinc-800/30 max-w-5xl mx-auto rounded-2xl backdrop:bg-zinc-800/60 backdrop-blur-xl",
      )}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 relative">
        <Image
          src={nft ? URL.createObjectURL(nft) : "/example1.png"}
          alt="nft"
          fill
          className="object-cover absolute inset-0 -z-10 filter blur-lg"
        />
        <div className="bg-black/80 absolute inset-0 -z-10" />
        <div className="w-full h-full grid place-items-center">
          {nft ? (
            <Image
              src={URL.createObjectURL(nft)}
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
              "p-5 flex flex-col items-center absolute bottom-0 inset-x-0 bg-zinc-900/50  filter backdrop-blur-3xl translate-y-[110%] overflow-hidden h-[95%] rounded-t-2xl shadow z-50 transition-transform",
              {
                "translate-y-0": isMinting,
              },
            )}
          >
            {MINTING_STATES.map(({ text, id }, i) => (
              <div
                key={id}
                className="flex items-center justify-center gap-2 font-bold text-lg text-zinc-500"
              >
                {mintingState[id as keyof typeof mintingState] ? (
                  <LuLoader2 className="opacity-80 animate-spin" />
                ) : (
                  <IoCheckmarkDone className="text-cyan-700" />
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

                <a
                  href={`https://sepolia.etherscan.io/search?f=0&q=${transactionHash}`}
                  target="_blank"
                  className="bg-zinc-700/80 ring-zinc-700 ring-2 rounded-xl p-4 w-full flex items-center gap-2 justify-center text-lg hover:brightness-125"
                >
                  <GoLinkExternal className="text-zinc-500 w-6 h-6" />
                  view on etherscan
                </a>
                <a
                  href={`https://testnets.opensea.io/assets/sepolia/${CONTRACT_ADDRESS}/${currentTokenId}`}
                  target="_blank"
                  className=" ring-zinc-700 ring-2 rounded-xl p-4 w-full flex items-center gap-2 justify-center text-lg hover:brightness-125"
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
            ) : null}
            {mintedNft && (
              <Confetti run={!mintedNft} width={width} height={height} />
            )}
          </div>

          {isMinting ? (
            <div className="absolute inset-0 bg-zinc-900/85 blur-[7rem]"></div>
          ) : (
            <>
              <input
                placeholder="Cyber Kangaroo"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  e.stopPropagation();
                }}
                className="px-4 py-3 ring-2 ring-zinc-600 bg-transparent w-full rounded-xl outline-none focus-within:brightness-110"
              />
              <textarea
                placeholder="Description of your nft"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  e.stopPropagation();
                }}
                className="resize-none flex-1 px-4 py-3 ring-2 ring-zinc-600 bg-transparent w-full rounded-xl outline-none focus-within:brightness-110"
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
