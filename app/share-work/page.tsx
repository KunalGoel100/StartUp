"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const initialForm = {
  makerName: "",
  city: "",
  email: "",
  dressTitle: "",
  category: "",
  materials: "",
  sizes: "",
  price: "",
  leadTime: "",
  description: "",
  story: "",
};

export default function ShareWorkPage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  }

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    setImages(selectedFiles);

    const previews = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewUrls(previews);
  };

  async function uploadImages(dressId: string) {
    for (const image of images) {
      const filename = `${Date.now()}-${image.name}`;

      const { error } = await supabase.storage
        .from("dress-images")
        .upload(filename, image);

      if (error) {
        console.error(error);
        continue;
      }

      const { data } = supabase.storage
        .from("dress-images")
        .getPublicUrl(filename);

      await supabase.from("dress_images").insert({
        dress_id: dressId,
        image_url: data.publicUrl,
      });
    }
  }

  const handleSubmit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (!user) {
      alert("Please login first");
      return;
    }

    const { data, error } = await supabase
  .from("dresses")
  .insert({
    seller_id: user.id,

    title: form.dressTitle,

    description: form.description,

    price: Number(form.price),

    category: form.category,

    material: form.materials,

    sizes: form.sizes,

    lead_time: form.leadTime,

    story: form.story,
  })
  .select()
  .single();

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    await uploadImages(data.id);

    setSubmitted(true);

    alert("Dress Added Successfully");

    setForm(initialForm);
    setImages([]);
    setPreviewUrls([]);
  };

  return (
    <main className="min-h-screen bg-[#f8f7f3] text-[#252823]">
      <header className="border-b border-black/5 bg-[#f8f7f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="text-xl font-semibold tracking-[-0.04em]">
            Atelier Folk
          </Link>
          <Link
            href="/"
            className="rounded-full border border-[#dfe3da] bg-white px-4 py-2 text-sm font-medium text-[#2f3b31]"
          >
            Back to home
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#879080]">
            Share your work
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
            Apply to feature your next dress.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#666d65]">
            Tell us about your design, add your collection details, and upload inspiration images.
          </p>
          {user && (
            <p className="mt-4 text-sm text-[#666d65]">
              Logged in as: <strong>{user.email}</strong>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6 rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_24px_70px_rgba(42,49,39,0.05)] sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-[#4d544d]">
                Maker name
                <input
                  type="text"
                  name="makerName"
                  value={form.makerName}
                  onChange={handleInputChange}
                  placeholder="Aisha Verma"
                  className="mt-2 w-full rounded-2xl border border-[#dfe3da] bg-[#f9f8f5] px-4 py-3 text-sm text-[#2d312d] outline-none placeholder:text-[#9aa196]"
                />
              </label>

              <label className="block text-sm font-medium text-[#4d544d]">
                City
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleInputChange}
                  placeholder="Mumbai"
                  className="mt-2 w-full rounded-2xl border border-[#dfe3da] bg-[#f9f8f5] px-4 py-3 text-sm text-[#2d312d] outline-none placeholder:text-[#9aa196]"
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-[#4d544d]">
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="hello@atelierfolk.com"
                  className="mt-2 w-full rounded-2xl border border-[#dfe3da] bg-[#f9f8f5] px-4 py-3 text-sm text-[#2d312d] outline-none placeholder:text-[#9aa196]"
                />
              </label>

              <label className="block text-sm font-medium text-[#4d544d]">
                Dress title
                <input
                  type="text"
                  name="dressTitle"
                  value={form.dressTitle}
                  onChange={handleInputChange}
                  placeholder="The Linen Study"
                  className="mt-2 w-full rounded-2xl border border-[#dfe3da] bg-[#f9f8f5] px-4 py-3 text-sm text-[#2d312d] outline-none placeholder:text-[#9aa196]"
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-[#4d544d]">
                Category
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  placeholder="Natural forms"
                  className="mt-2 w-full rounded-2xl border border-[#dfe3da] bg-[#f9f8f5] px-4 py-3 text-sm text-[#2d312d] outline-none placeholder:text-[#9aa196]"
                />
              </label>

              <label className="block text-sm font-medium text-[#4d544d]">
                Price
                <input
                  type="text"
                  name="price"
                  value={form.price}
                  onChange={handleInputChange}
                  placeholder="₹4,800"
                  className="mt-2 w-full rounded-2xl border border-[#dfe3da] bg-[#f9f8f5] px-4 py-3 text-sm text-[#2d312d] outline-none placeholder:text-[#9aa196]"
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-[#4d544d]">
                Materials
                <input
                  type="text"
                  name="materials"
                  value={form.materials}
                  onChange={handleInputChange}
                  placeholder="100% pre-washed linen"
                  className="mt-2 w-full rounded-2xl border border-[#dfe3da] bg-[#f9f8f5] px-4 py-3 text-sm text-[#2d312d] outline-none placeholder:text-[#9aa196]"
                />
              </label>

              <label className="block text-sm font-medium text-[#4d544d]">
                Sizes
                <input
                  type="text"
                  name="sizes"
                  value={form.sizes}
                  onChange={handleInputChange}
                  placeholder="XS, S, M, L, XL"
                  className="mt-2 w-full rounded-2xl border border-[#dfe3da] bg-[#f9f8f5] px-4 py-3 text-sm text-[#2d312d] outline-none placeholder:text-[#9aa196]"
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-[#4d544d]">
              Lead time
              <input
                type="text"
                name="leadTime"
                value={form.leadTime}
                onChange={handleInputChange}
                placeholder="Made to order in 10–14 days"
                className="mt-2 w-full rounded-2xl border border-[#dfe3da] bg-[#f9f8f5] px-4 py-3 text-sm text-[#2d312d] outline-none placeholder:text-[#9aa196]"
              />
            </label>

            <label className="block text-sm font-medium text-[#4d544d]">
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe the dress, silhouette, feel, and who it is for."
                className="mt-2 w-full rounded-2xl border border-[#dfe3da] bg-[#f9f8f5] px-4 py-3 text-sm text-[#2d312d] outline-none placeholder:text-[#9aa196]"
              />
            </label>

            <label className="block text-sm font-medium text-[#4d544d]">
              Story behind the piece
              <textarea
                name="story"
                value={form.story}
                onChange={handleInputChange}
                rows={4}
                placeholder="Share the inspiration, process, and what makes this design special."
                className="mt-2 w-full rounded-2xl border border-[#dfe3da] bg-[#f9f8f5] px-4 py-3 text-sm text-[#2d312d] outline-none placeholder:text-[#9aa196]"
              />
            </label>

            <div className="rounded-[1.5rem] border border-dashed border-[#ccd3c7] bg-[#f7f7f4] p-5">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 text-center">
                <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#2f3b31]">
                  Upload design images
                </span>
                <span className="text-sm text-[#656d64]">Add your mood board or finished dress photos.</span>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              {previewUrls.length > 0 && (
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {previewUrls.map((url, index) => (
                    <img
                      key={url}
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="h-28 w-full rounded-2xl object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#2f3b31] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#202a23]"
            >
              Publish Dress
            </button>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-[#eef0ea] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#879080]">Application checklist</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[#5f675d]">
                <li>• Add a clear dress title and material notes.</li>
                <li>• Share your inspiration or story behind the design.</li>
                <li>• Upload at least 3 photos in natural light.</li>
                <li>• Include sizing and timeline details for buyers.</li>
              </ul>
            </div>

            <div className="rounded-[2rem] border border-[#dfe3da] bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#879080]">Preview</p>
              <div className="mt-4 rounded-[1.5rem] bg-[#f4f2ee] p-4">
                <div className="h-44 rounded-[1.2rem] bg-[linear-gradient(145deg,#d8c0ab,#efe6df)]" />
                <div className="mt-4">
                  <h3 className="text-xl font-medium tracking-[-0.03em]">
                    {form.dressTitle || "Your dress title"}
                  </h3>
                  <p className="mt-1 text-sm text-[#6a7169]">
                    {form.category || "Collection category"}
                  </p>
                  <p className="mt-3 text-sm text-[#586156]">
                    {form.description || "Add a short description about your dress and its feel."}
                  </p>
                  <p className="mt-4 text-base font-semibold text-[#2f3b31]">
                    {form.price || "₹0"}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </form>

        {submitted && (
          <div className="mt-8 rounded-[1.5rem] border border-[#d8e3d5] bg-[#edf6ea] px-5 py-4 text-sm text-[#2f5035]">
            Your dress has been published successfully and is now visible on the marketplace.
          </div>
        )}
      </section>
    </main>
  );
}
