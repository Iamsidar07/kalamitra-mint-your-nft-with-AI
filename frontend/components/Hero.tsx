import Image from "next/image";

const Hero = () => {
  return (
    <section className="flex flex-col items-center">
      <span className="ring-2 ring-zinc-800 px-6 py-3 rounded-full text-zinc-400">
        Welcome to the KalaMitra
      </span>
      <h1 className="text-2xl md:text-3xl lg:text-6xl font-bold text-center mt-6">
        Generate and Mint Your <br /> Own nft with <br />{" "}
        <div className="flex items-center gap-2 justify-center">
          <Image
            src="/logo.png"
            alt="emoji"
            width={50}
            height={50}
            quality={100}
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-24 md:h-24 object-contain"
          />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9104B3] to-[#3FE7E6] inline-block">
            KalaMitra
          </span>
        </div>
      </h1>
    </section>
  );
};

export default Hero;
