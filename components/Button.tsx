import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  loading?: boolean;
};

const Button = ({
  children,
  type = "button",
  disabled = false,
  className = "",
  onClick,
  loading = false,
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={className}
      onClick={onClick}
    >
      {loading ? <span className="text-white">Loading</span> : children}
    </button>
  );
};

export default Button;
