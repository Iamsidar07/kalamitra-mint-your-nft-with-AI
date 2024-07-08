import Image from "next/image";
import Button from "./Button";
import { MdOutlineContentCopy } from "react-icons/md";
import { toast } from "react-toastify";

interface PromptExampleItemProps {
  imageUrl: string;
  name: string;
  prompt: string;
}

const PromptExampleItem = ({
  name,
  imageUrl,
  prompt,
}: PromptExampleItemProps) => {
  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    toast("🫣 Prompt copied.");
  };
  return (
    <div className="sm:h-72 flex flex-col md:flex-row p-4 filter backdrop-blur-3xl bg-zinc-800/30 ring-2 ring-zinc-800/80 bg-opacity-10 rounded-lg gap-4">
      <Image
        src={imageUrl}
        alt={name}
        width={200}
        height={200}
        className="object-cover w-full aspect-square"
      />
      <div className="h-full relative space-y-2">
        <h3 className="text-base md:text-lg">{name}</h3>
        <p className="uppercase text-wrap text-zinc-400 truncate text-xs sm:text-sm">
          {prompt}
        </p>
        <Button
          onClick={copyPrompt}
          className="sm:absolute bottom-2 left-2 flex items-center gap-2"
        >
          Copy
          <MdOutlineContentCopy />
        </Button>
      </div>
    </div>
  );
};

export default PromptExampleItem;
