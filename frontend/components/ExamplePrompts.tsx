import { PROMPT_EXAMPLES } from "@/constants";
import PromptExampleItem from "./PromptExampleItem";

const ExamplePrompts = () => {
  return (
    <section className="py-12 md:py-24 relative px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-center">
        Prompt Examples
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
        {PROMPT_EXAMPLES.map((item, i) => (
          <PromptExampleItem {...item} key={i} />
        ))}
      </div>
      <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 -z-10 w-96 h-96 rounded-full bg-[#3FE7E6] filter blur-[25rem] " />
    </section>
  );
};

export default ExamplePrompts;
