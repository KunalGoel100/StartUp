"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

import SiteHeader from "@/components/SiteHeader";
import DressVisual from "@/components/DressVisual";
import DressCard from "@/components/DressCard";

import { creators } from "@/data/creators";
import { collections } from "@/data/collections";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [dresses, setDresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDresses();
  }, []);

  async function loadDresses() {
    const { data, error } = await supabase
      .from("dresses")
      .select(
        `
        *,
        dress_images (
          image_url
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setDresses(data || []);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#f8f7f3] text-[#252823]">
      <SiteHeader />

      {/* HERO SECTION */}
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-16 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#dfe3da] bg-white/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-[#697265]">
              <Sparkles size={14} />
              Made slowly, shared proudly
            </div>

            <h1 className="text-5xl font-medium leading-[1.03] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Beautiful clothes,
              <span className="block font-serif italic text-[#788171]">
                made for the joy of it.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-[#71766e]">
              Discover thoughtful dresses created by independent hobbyists
              and explore every detail behind each piece.
            </p>
          </div>

          <DressVisual
            palette={collections[0].gallery[0]}
            className="h-[520px] rounded-[2rem]"
          />
        </div>
      </section>

      {/* DYNAMIC DRESSES */}
      <section
        id="discover"
        className="border-y border-black/5 bg-white/55 py-20"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#879080]">
            Latest Dresses
          </p>

          <h2 className="mb-10 mt-3 text-4xl font-medium tracking-[-0.04em]">
            Discover handmade creations
          </h2>

          {loading ? (
            <div className="text-center py-10">
              Loading dresses...
            </div>
          ) : dresses.length === 0 ? (
            <div className="text-center py-10">
              No dresses available yet.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {dresses.map((dress) => (
                <DressCard
                  key={dress.id}
                  dress={dress}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MAKERS SECTION */}
      <section id="makers" className="py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#879080]">
            The makers
          </p>

          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-4xl font-medium tracking-[-0.04em]">
              Meet our creators
            </h2>

            <p className="max-w-xl text-base leading-7 text-[#666d65]">
              Thoughtful design begins with small-batch experiments,
              generous fabrics, and a deep respect for the way clothes
              are worn every day.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {creators.map((creator) => (
              <article
                key={creator.id}
                className="overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-[0_20px_50px_rgba(43,49,38,0.06)]"
              >
                <div className="p-4">
                  <DressVisual
                    palette={creator.colors}
                    className="h-64 rounded-[1.4rem]"
                  />
                </div>

                <div className="px-6 pb-6 pt-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-medium tracking-[-0.03em]">
                        {creator.name}
                      </h3>
                      <p className="mt-1 text-sm text-[#71786f]">
                        {creator.city}
                      </p>
                    </div>

                    <span className="rounded-full border border-[#dfe3da] bg-[#f8f7f3] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#697265]">
                      {creator.palette}
                    </span>
                  </div>

                  <p className="mt-5 text-sm leading-6 text-[#586156]">
                    {creator.specialty}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN SECTION */}
      <section id="join" className="bg-[#eef0ea] py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="rounded-[2rem] border border-[#dfe3da] bg-white px-6 py-8 shadow-[0_20px_60px_rgba(42,49,39,0.04)] sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#879080]">
                  Join the community
                </p>

                <h2 className="mt-3 text-4xl font-medium tracking-[-0.04em]">
                  Share your work with a slower, more thoughtful audience.
                </h2>

                <p className="mt-4 max-w-xl text-base leading-7 text-[#676f67]">
                  Apply to feature your pieces, connect with independent
                  makers, and be part of a collection built around craft,
                  story, and beautiful everyday wear.
                </p>
              </div>

              <div className="rounded-[1.5rem] bg-[#f6f4ef] p-5 sm:p-6">
                <label className="block text-sm font-medium text-[#4d544d]">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="hello@atelierfolk.com"
                  className="mt-3 w-full rounded-2xl border border-[#dfe3da] bg-white px-4 py-3 text-sm text-[#2d312d] outline-none placeholder:text-[#959a94]"
                />

                <button className="mt-4 w-full rounded-full bg-[#2f3b31] px-5 py-3 text-sm font-medium text-white">
                  Apply to join
                </button>

                <p className="mt-3 text-xs text-[#70776e]">
                  We review each application within 3–5 working days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/5 px-5 py-8 text-sm text-[#7b8178]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Atelier Folk</p>
          <p>Independent fashion, thoughtfully shared.</p>
        </div>
      </footer>
    </main>
  );
}