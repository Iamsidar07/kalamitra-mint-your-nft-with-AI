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
      type: "website",
      locale: "en_US",
      url: "https://kalamitra-mint-your-nft-with-ai.vercel.app",
      title: "KalaMitra - Mint NFT with AI",
      description: "Generate and mint NFT with AI",
      images: [
        {
          url: "https://kalamitra-mint-your-nft-with-ai.vercel.app/og.png",
          width: 1200,
          height: 630,
          alt: "KalaMitra - Mint NFT with AI",
        },
      ],
      siteName: "KalaMitra - Mint NFT with AI",
    },
  };
}
