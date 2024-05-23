interface ButtonProps {
  children: React.ReactNode;
  enabled?: boolean;
  onClick?: () => void;
  className?: string
}
const Button = ({ children, enabled, onClick, className }: ButtonProps) => {
  if (typeof enabled === "undefined") enabled = true;
  return (
    <button onClick={onClick}
      className={`bg-[buttonface] border-black p-2 rounded border-[1px] hover:bg-[#f5f5f5] hover:border-slate-200 hover:text-slate-400 cursor-pointer ${
        enabled
          ? ""
          : ""
      } ${className??""}`}
    >
      {children}
    </button>
  );
};

export default Button;
