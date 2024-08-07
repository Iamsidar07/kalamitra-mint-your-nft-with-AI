import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}
export default function Button({
  children,
  onClick,
  className,
  disabled,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) {
          onClick();
        }
      }}
      className={cn(
        "cursor pointer px-4 py-3 disabled:bg-opacity-40 bg-gray-800/40 bg-opacity-50 font-bold rounded-xl border border-gray-800 filter backdrop-blur-2xl active:scale-95 transition-transform",
        className,
      )}
    >
      {children}
    </button>
  );
}
