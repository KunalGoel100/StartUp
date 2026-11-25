"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Share2,
} from "lucide-react";

export default function ProductDetail({ product }: { product: any }) {
  const [image, setImage] = useState(0);
  const [size, setSize] = useState("");
  const [saved, setSaved] = useState(false);
  const [sent, setSent] = useState(false);

  const prev = () =>
    setImage((i: number) =>
      i === 0 ? product.gallery.length - 1 : i - 1
    );

  const next = () =>
    setImage((i: number) =>
      i === product.gallery.length - 1 ? 0 : i + 1
    );

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 lg:px-8">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-sm font-medium text-[#636b60]"
      >
        <ArrowLeft size={17} />
        Back to collections
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.08fr_.92fr]">
        <div>
          <div className="relative overflow-hidden rounded-[2rem] bg-white">
            <img
              src={product.gallery?.[image]?.image_url}
              alt={product.title}
              className="h-[540px] w-full object-cover sm:h-[680px]"
            />

            {product.gallery?.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous image"
                  className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-3"
                >
                  <ChevronLeft />
                </button>

                <button
                  onClick={next}
                  aria-label="Next image"
                  className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-3"
                >
                  <ChevronRight />
                </button>
              </>
            )}

            <span className="absolute bottom-5 right-5 rounded-full bg-black/45 px-3 py-1.5 text-xs text-white">
              {image + 1} / {product.gallery?.length || 1}
            </span>
          </div>

          {product.gallery?.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.gallery.map((img: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setImage(i)}
                  className={`overflow-hidden rounded-2xl border-2 ${
                    image === i
                      ? "border-[#4f5c4d]"
                      : "border-transparent opacity-70"
                  }`}
                >
                  <img
                    src={img.image_url}
                    alt={`${product.title}-${i}`}
                    className="h-28 w-full object-cover sm:h-36"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-28 lg:h-fit">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#879080]">
            {product.category}
          </p>

          <div className="mt-3 flex justify-between gap-6">
            <div>
              <h1 className="text-4xl font-medium sm:text-5xl">
                {product.title}
              </h1>

              <p className="mt-2 text-[#757c72]">
                {product.subtitle}
              </p>
            </div>

            <button
              onClick={() => setSaved(!saved)}
              className="h-fit rounded-full border bg-white p-3"
            >
              <Heart
                className={
                  saved
                    ? "fill-[#7d8878] text-[#7d8878]"
                    : ""
                }
              />
            </button>
          </div>

          <p className="mt-7 text-2xl font-semibold">
            {product.price}
          </p>

          <p className="mt-2 text-sm text-[#71786e]">
            {product.leadTime}
          </p>

          <p className="mt-7 leading-7 text-[#5f675d]">
            {product.description}
          </p>

          <div className="mt-8">
            <p className="text-sm font-semibold">
              Choose size
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes?.map((s: string) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`rounded-full border px-4 py-2.5 text-sm ${
                    size === s
                      ? "bg-[#2f3b31] text-white"
                      : "bg-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => size && setSent(true)}
            className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-medium text-white ${
              size
                ? "bg-[#2f3b31]"
                : "cursor-not-allowed bg-[#9ba198]"
            }`}
          >
            Contact maker about this dress
            <ArrowRight size={16} />
          </button>

          {!size && (
            <p className="mt-2 text-center text-xs">
              Select a size first.
            </p>
          )}

          {sent && (
            <p className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#e8eee5] p-3 text-sm">
              <Check size={16} />
              Your enquiry has been prepared.
            </p>
          )}

          <div className="mt-8 divide-y rounded-2xl bg-white px-5">
            <p className="flex justify-between py-4 text-sm">
              <span>Material</span>
              <b>{product.material}</b>
            </p>

            <p className="flex justify-between py-4 text-sm">
              <span>Fit</span>
              <b>{product.fit}</b>
            </p>

            <p className="flex justify-between py-4 text-sm">
              <span>Care</span>
              <b>{product.care}</b>
            </p>
          </div>

          <div className="mt-8 rounded-2xl bg-[#e5e8e0] p-6">
            <b className="text-xs uppercase">
              The story
            </b>

            <p className="mt-3 leading-7">
              {product.story}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-5">
            <div>
              <small>Made by</small>

              <p className="font-semibold">
                {product.maker}
              </p>

              <p className="flex items-center gap-1 text-sm">
                <MapPin size={14} />
                {product.city}
              </p>
            </div>

            <button className="rounded-full border p-3">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}