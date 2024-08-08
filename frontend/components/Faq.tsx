import { cn } from "@/lib/utils";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const FAQS = [
  {
    question: "What is NFT?",
    answer:
      "An NFT (Non-Fungible Token) is a unique digital asset that represents ownership of a specific item, such as art, collectibles, or virtual real estate.",
  },
  {
    question: "How do I get started?",
    answer:
      "To get started, simply connect your wallet and explore our AI-powered NFT generator or upload your own artwork to mint.",
  },
  {
    question: "What is the roadmap for this project?",
    answer:
      "We have an exciting roadmap that includes new features, partnerships, and community events.",
  },
  {
    question: "What are the benefits of minting NFTs?",
    answer:
      "Minting NFTs allows you to create digital scarcity, track ownership, and potentially earn royalties from secondary sales.",
  },
];
const Faq = () => {
  const [currentActive, setCurrentActive] = useState(0);
  return (
    <section className="px-4 py-24">
      <h2 className="text-lg md:text-6xl font-bold text-center mb-12">
        FAQ&apos;s
      </h2>{" "}
      <div className="space-y-4 ">
        {FAQS.map(({ question, answer }, i) => {
          const showFaq = i === currentActive;
          return (
            <div
              key={question}
              className="border-b border-zinc-800 last:border-0 py-4"
            >
              <div
                onClick={() => setCurrentActive(currentActive === i ? -1 : i)}
                className="flex justify-between cursor-pointer"
              >
                <h3 className="font-bold text-base sm:text-lg">{question}</h3>{" "}
                <FiChevronDown
                  className={cn("w-4 h-4 transition-transform", {
                    "rotate-180": showFaq,
                  })}
                />{" "}
              </div>{" "}
              <p
                className={cn(
                  "overflow-hidden transition-all duration-300 text-zinc-400",
                  {
                    "max-h-0 opacity-0 py-0": !showFaq,
                    "max-h-40 opacity-100 py-2": showFaq,
                  },
                )}
              >
                {answer}
              </p>{" "}
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default Faq;
