import Link from "next/link";
import CardFrame from "@/components/CardFrame";
import CardImage from "@/components/CardImage";

type DressCardProps = {
  dress: {
    id: string;
    title: string;
    description: string;
    price: number;
    category?: string | null;
    dress_images?: {
      image_url: string;
    }[];
  };
};

export default function DressCard({ dress }: DressCardProps) {
  const image =
    dress.dress_images?.[0]?.image_url ||
    "https://placehold.co/600x800?text=No+Image";

  return (
    <Link href={`/collections/${dress.id}`}>
      <CardFrame>
        <CardImage
          src={image}
          alt={dress.title}
          className="h-[430px] w-full object-cover"
        />

        <div className="p-6">
          <div className="flex justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-[#899083]">
                {dress.category || "Handmade"}
              </p>

              <h3 className="mt-2 text-2xl font-medium text-[#2f3a2f]">
                {dress.title}
              </h3>

              <p className="mt-2 line-clamp-2 text-sm text-[#777d73]">
                {dress.description}
              </p>
            </div>

            <span className="whitespace-nowrap text-sm font-semibold text-[#2f3a2f]">
              ₹{dress.price}
            </span>
          </div>

          <div
            className="
              mt-5
              border-t
              border-black/5
              pt-4
              text-sm
              font-medium
              text-[#596356]
              transition-all
              duration-300
              group-hover:translate-x-1
            "
          >
            View dress details →
          </div>
        </div>
      </CardFrame>
    </Link>
  );
}