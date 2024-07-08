import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { cn, getMetadata } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Web3Provider } from "@/components/web3";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = getMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-black -z-50 relative overflow-x-hidden",
          lexend.className,
        )}
      >
        <Web3Provider>
          <Navbar />
          {children}
        </Web3Provider>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
      </body>
    </html>
  );
}
