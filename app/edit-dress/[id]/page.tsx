"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SiteHeader from "@/components/SiteHeader";

export default function EditDressPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [sizes, setSizes] = useState("");
  const [leadTime, setLeadTime] = useState("");
  const [story, setStory] = useState("");

  useEffect(() => {
    if (id) {
      loadDress();
    }
  }, [id]);

  async function loadDress() {
    const { data, error } = await supabase
      .from("dresses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setTitle(data.title || "");
    setDescription(data.description || "");
    setPrice(data.price?.toString() || "");

    setCategory(data.category || "");
    setMaterial(data.material || "");
    setSizes(data.sizes || "");
    setLeadTime(data.lead_time || "");
    setStory(data.story || "");

    setLoading(false);
  }

  async function updateDress() {
    setSaving(true);

    const { error } = await supabase
      .from("dresses")
      .update({
        title,
        description,
        price: Number(price),

        category,
        material,
        sizes,
        lead_time: leadTime,
        story,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Dress updated successfully");

    router.push("/profile");
  }

  if (loading) {
    return (
      <>
        <SiteHeader />
        <div className="p-10 text-center">
          Loading dress...
        </div>
      </>
    );
  }

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-[#f8f7f3]">
        <div className="mx-auto max-w-4xl px-5 py-12">

          <div className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(42,49,39,0.06)]">

            <h1 className="text-4xl font-semibold">
              Edit Dress
            </h1>

            <p className="mt-2 text-[#6c736a]">
              Update your dress information.
            </p>

            <div className="mt-8 space-y-5">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Dress Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-[#dfe3da] px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-2xl border border-[#dfe3da] px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Price
                </label>

                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-2xl border border-[#dfe3da] px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Material
                </label>

                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full rounded-2xl border border-[#dfe3da] px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Sizes
                </label>

                <input
                  type="text"
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  placeholder="XS,S,M,L,XL"
                  className="w-full rounded-2xl border border-[#dfe3da] px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Lead Time
                </label>

                <input
                  type="text"
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                  className="w-full rounded-2xl border border-[#dfe3da] px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  className="w-full rounded-2xl border border-[#dfe3da] px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Story
                </label>

                <textarea
                  rows={5}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="w-full rounded-2xl border border-[#dfe3da] px-4 py-3"
                />
              </div>

              <button
                onClick={updateDress}
                disabled={saving}
                className="w-full rounded-full bg-[#2f3b31] px-5 py-3 text-sm font-medium text-white"
              >
                {saving
                  ? "Saving Changes..."
                  : "Update Dress"}
              </button>

            </div>
          </div>

        </div>
      </main>
    </>
  );
}