"use client";
import Image from "next/image";
import Button from "./Button";
import useWeb3 from "./web3";

const Navbar = () => {
  const { connectWalletPressed, walletAddress, disconnectWallet } = useWeb3();
  return (
    <header>
      <nav className="flex items-center justify-between  max-w-7xl mx-auto px-6 py-4 w-full">
        <span className="text-lg sm:text-3xl font-bold uppercase">
          🫡KalaMitra
        </span>
        <Button
          onClick={walletAddress ? disconnectWallet : connectWalletPressed}
          className="flex items-center justify-center gap-1.5"
        >
          <Image
            src="/metamask-icon.svg"
            alt="Metamask logo"
            width={20}
            height={20}
          />
          {walletAddress.length > 0 ? (
            walletAddress.substring(0, 6) + "..." + walletAddress.substring(38)
          ) : (
            <span>Connect Wallet</span>
          )}
        </Button>
      </nav>
    </header>
  );
};

export default Navbar;
