interface ButtonProps {
  children: React.ReactNode;
  enabled?: boolean;
  onClick?: () => void;
  className?: string,
  type?:"button" | "submit" | "reset" | undefined
}
const Button = ({ children, enabled, onClick, className, type }: ButtonProps) => {
  if (typeof enabled === "undefined") enabled = true;
  return (
    <button onClick={onClick}
    type={type}
      className={`bg-[buttonface]  p-2 rounded border-[1px]  ${
        enabled
          ? "border-black hover:bg-[#f5f5f5] hover:border-slate-200 hover:text-slate-400 cursor-pointer"
          : "bg-[#f5f5f5] border-[1px] border-slate-200 text-slate-400 cursor-default"
      } ${className??""}`}
    >
      {children}
    </button>
  );
};

export default Button;
