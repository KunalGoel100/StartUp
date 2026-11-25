import type { Palette } from "@/types/fashion";
export default function DressVisual({palette,className=""}:{palette:Palette;className?:string}) {
 const [background,backgroundTwo,accent]=palette;
 return <div className={`relative overflow-hidden ${className}`} style={{background:`linear-gradient(145deg, ${background}, ${backgroundTwo})`}}>
  <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/25 blur-2xl"/><div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/20 blur-3xl"/>
  <div className="absolute left-1/2 top-[48%] h-[68%] w-[48%] -translate-x-1/2 -translate-y-1/2"><div className="absolute left-1/2 top-0 h-[13%] w-[17%] -translate-x-1/2 rounded-full bg-[#d8b7a0]"/><div className="absolute left-1/2 top-[10%] h-[12%] w-[30%] -translate-x-1/2 rounded-t-[60%] bg-[#4c403b]"/><div className="absolute left-1/2 top-[18%] h-[28%] w-[38%] -translate-x-1/2 rounded-t-[45%] shadow-sm" style={{backgroundColor:accent}}/><div className="absolute left-1/2 top-[39%] h-[58%] w-[88%] -translate-x-1/2" style={{background:`linear-gradient(150deg, ${accent}, ${background})`,clipPath:"polygon(32% 0,68% 0,100% 100%,0 100%)",borderRadius:"0 0 38% 38%"}}/><div className="absolute left-[22%] top-[27%] h-[38%] w-[5%] -rotate-12 rounded-full bg-[#d8b7a0]"/><div className="absolute right-[22%] top-[27%] h-[38%] w-[5%] rotate-12 rounded-full bg-[#d8b7a0]"/></div>
 </div>;
}
