import { cn } from "@/lib/utils";
import Image from "next/image";

interface FeatureItemProps {
  title: string;
  description: string;
  imageUrl: string;
  isReverse?: boolean;
  tagline: string;
  gradient?: string;
}

const FeatureItem = ({
  title,
  tagline,
  description,
  imageUrl,
  isReverse,
  gradient,
}: FeatureItemProps) => {
  return (
    <section
      className={cn("flex flex-col md:flex-row items-center gap-8 relative", {
        "md:flex-row-reverse": isReverse,
      })}
    >
      <Image
        src={imageUrl}
        alt="feature"
        width={1024}
        height={1024}
        className="w-full max-w-lg"
      />
      <div
        className={`absolute w-72 h-72 rounded-full filter blur-[10rem]  -z-10 ${
          gradient ? gradient : "bg-[#C39156]"
        }`}
      />
      <div className="space-y-4 p-4 sm:p-0">
        <span className="text-xs sm:text-sm uppercase text-gray-500 px-4 py-1 sm:py-1.5 rounded-full ring-1 ring-gray-800">
          {tagline}
        </span>
        <h2 className="text-lg md:text-6xl font-semibold capitalize">{title}</h2>
        <p className="text-zinc-500 sm:text-lg">{description}</p>
      </div>
    </section>
  );
};

const Features = () => {
  return (
    <div className="gap-6 w-full">
      <FeatureItem
        title="Generate nft with ai"
        tagline="Generate nft with ai"
        description="Our advance AI algorithms generate unique and visually stunning NFTs, allowing you to create one-of-a-kined digital art with ease"
        imageUrl="/generate_image.png"
      />
      <FeatureItem
        title="Bring your existing Art to life"
        tagline="Upload and mint nfts"
        description="Easily upload your existing digital artwork and mint them as unique NFTs on the blockchain. Unlock a new way to showcase your creation"
        imageUrl="/upload_image.png"
        gradient="bg-[#5E56D5]"
        isReverse={true}
      />
    </div>
  );
};

export default Features;
