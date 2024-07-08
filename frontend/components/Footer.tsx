import React from "react";

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row items-center border-t border-zinc-800 justify-center gap-4 text-zinc-500 text-xs pt-12">
      <p>
        &copy;{new Date().getFullYear().toString()} KalaMitra All rights
        reserved
      </p>
      <div className="flex items-center gap-2">
        <a href={"#"} target={"_blank"}>
          Terms of service
        </a>
        <a href={"#"} target={"_blank"}>
          Privacy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
