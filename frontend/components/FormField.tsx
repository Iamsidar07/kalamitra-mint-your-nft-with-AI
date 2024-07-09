"use client";
import Image from "next/image";
import React from "react";
import Button from "./Button";
import { BiImage } from "react-icons/bi";
import { FaImage } from "react-icons/fa";
import { BsStars } from "react-icons/bs";

interface FormFieldProps {
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleGenerateImage: () => void;
  handleSupriseMe: () => void;
  isImageGenerationLoading: boolean;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
}

const FormField = ({
  handleImageChange,
  handleGenerateImage,
  handleSupriseMe,
  isImageGenerationLoading,
  prompt,
  setPrompt,
}: FormFieldProps) => {
  return (
    <section className="flex items-center justify-center w-[90%] mx-auto pt-32">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-2 w-full max-w-4xl mx-auto bg-zinc-800 backdrop-blur-3xl filter bg-opacity-10 px-3 py-2 rounded-lg ring-8 ring-offset-1 ring-offset-zinc-500/10 ring-zinc-500/10 focus-within:ring-offset-2 focus-within:ring-offset-zinc-500/10 focus-within:brightness-110">
        <div className="flex items-center gap-2 w-full">
          <label
            htmlFor="uploadImage"
            className="bg-white bg-opacity-60 p-1.5 sm:px-4 sm:py-3 rounded-lg grid place-items-center cursor-pointer"
          >
            <FaImage className="opacity-80 w-5 h-5 text-black" />
          </label>
          <input
            type="file"
            accept="image/*"
            id="uploadImage"
            className="hidden"
            onChange={handleImageChange}
          />

          <input
            placeholder="Lighthouse on a cliff overlooking the ocean"
            className="flex-1 bg-transparent focus:outline-none h-full"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button
            onClick={handleSupriseMe}
            className="grid place-items-center bg-white cursor-pointer hover:brightness-125 p-1.5 sm:px-4 sm:py-3"
          >
            <BsStars className="opacity-80 text-black w-5 h-5" />
          </Button>
        </div>
        <Button
          onClick={handleGenerateImage}
          disabled={!prompt}
          className="bg-white text-black bg-opacity-100 w-full sm:w-auto"
        >
          {isImageGenerationLoading ? "Generating..." : "Generate"}
        </Button>
      </div>
    </section>
  );
};

export default FormField;
