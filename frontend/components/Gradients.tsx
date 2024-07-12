const Gradients = () => {
  return (
    <>
      {/* Gradient backgrounds */}
      <div className="absolute -top-12 -left-24 -z-10 w-[25rem] h-[35rem] rounded-full bg-[#9104B3] filter blur-[18rem] " />
      <div className="absolute right-0 sm:-right-[5%] -z-10 w-96 h-96 rounded-full bg-[#3FE7E6] filter blur-[25rem] " />
      <div className="absolute bottom-0 inset-x-0 h-1  bg-gradient-to-r from-violet-600 to-cyan-500" />
    </>
  );
};

export default Gradients;
