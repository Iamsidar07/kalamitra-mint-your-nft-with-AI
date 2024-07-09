import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMetadata() {
  return {
    title: "KalaMitra - Mint NFT with AI",
    description: "Generate and mint NFT with AI",
    openGraph: {
      title: "KalaMitra - Mint and Generate NFT with AI",
      description: "KalaMitra - enables you to generate and minft NFT with AI",
      type: "website",
      url: "https://kalamitra-mint-your-nft-with-ai.vercel.app",
      images: [
        {
          url: "https://kalamitra-mint-your-nft-with-ai.vercel.app/og.png",
          width: 511,
          height: 288,
        },
      ],
    },
    twitter: {
      title: "KalaMitra - Mint NFT with AI",
      description: "Generate and mint NFT with AI",
      card: "summary_large_image",
      images: [
        {
          url: "https://kalamitra-mint-your-nft-with-ai.vercel.app/og.png",
          width: 511,
          height: 288,
          alt: "KalaMitra - Mint NFT with AI",
        },
      ],
    },
    manifest: "/manifest.json",
  };
}
