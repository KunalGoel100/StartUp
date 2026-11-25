type CardImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function CardImage({
  src,
  alt,
  className = "",
}: CardImageProps) {
  return (
    <div className="relative overflow-hidden">
      <img
        src={src}
        alt={alt}
        className={`
          transition-transform
          duration-700
          ease-out
          group-hover:scale-105
          ${className}
        `}
      />

      <div
        className="
          absolute
          inset-0
          bg-black/0
          transition-all
          duration-700
          group-hover:bg-black/[0.03]
        "
      />
    </div>
  );
}