import { ReactNode } from "react";

type CardFrameProps = {
  children: ReactNode;
  className?: string;
};

export default function CardFrame({
  children,
  className = "",
}: CardFrameProps) {
  return (
    <div
      className={`
        group
        overflow-hidden
        rounded-[1.75rem]
        bg-white
        shadow-[0_18px_55px_rgba(42,49,39,0.06)]
        transition-all
        duration-500
        hover:-translate-y-2
        hover:shadow-[0_28px_75px_rgba(42,49,39,0.12)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}