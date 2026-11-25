import Link from "next/link";

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
    <Link
      href={`/collections/${dress.id}`}
      className="group overflow-hidden rounded-[1.75rem] bg-white shadow-[0_18px_55px_rgba(42,49,39,0.06)] transition hover:-translate-y-1"
    >
      <div className="overflow-hidden">
        <img
          src={image}
          alt={dress.title}
          className="h-[430px] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-[#899083]">
              {dress.category || "Handmade"}
            </p>

            <h3 className="mt-2 text-2xl font-medium">
              {dress.title}
            </h3>

            <p className="mt-1 line-clamp-2 text-sm text-[#777d73]">
              {dress.description}
            </p>
          </div>

          <span className="whitespace-nowrap text-sm font-semibold">
            ₹{dress.price}
          </span>
        </div>

        <div className="mt-5 border-t border-black/5 pt-4 text-sm font-medium text-[#596356]">
          View dress details →
        </div>
      </div>
    </Link>
  );
}