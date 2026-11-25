"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import SiteHeader from "@/components/SiteHeader";
import CardFrame from "@/components/CardFrame";
import CardImage from "@/components/CardImage";

type Profile = {
  name?: string;
  city?: string;
  email?: string;
  bio?: string;
  profile_image?: string;
};

type Dress = {
  id: string;
  title: string;
  price: number;
  category?: string;
  dress_images?: { image_url: string }[];
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dressCount, setDressCount] = useState(0);
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const [profileResult, countResult, dressResult] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("dresses").select("*", { count: "exact", head: true }).eq("seller_id", user.id),
      supabase
        .from("dresses")
        .select("*, dress_images(image_url)")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    setProfile(profileResult.data);
    setDressCount(countResult.count || 0);
    setDresses(dressResult.data || []);
    setLoading(false);
  }

  async function deleteDress(dressId: string) {
    if (!window.confirm("Are you sure you want to delete this dress?")) return;

    await supabase.from("dress_images").delete().eq("dress_id", dressId);
    const { error } = await supabase
      .from("dresses")
      .delete()
      .eq("id", dressId);

    if (error) {
      alert(error.message);
      return;
    }

    setDresses((current) => current.filter((dress) => dress.id !== dressId));
    setDressCount((current) => Math.max(0, current - 1));
    alert("Dress deleted successfully");
  }

  if (loading) {
    return (
      <>
        <SiteHeader />
        <div className="p-10 text-center">Loading profile...</div>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#f8f7f3]">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
            <div className="h-28 bg-[#e7ddd3]" />
            <div className="px-8 pb-10">
              <div className="-mt-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-end sm:text-left">
                  <img
                    src={profile?.profile_image || "https://placehold.co/300x300?text=Profile"}
                    alt="Profile"
                    className="h-36 w-36 rounded-full border-4 border-white bg-white object-cover shadow-md"
                  />
                  <div className="min-w-0 pb-1">
                    <h1 className="text-4xl font-semibold tracking-tight text-[#2f312d]">
                      {profile?.name || "Unnamed Creator"}
                    </h1>
                    <p className="mt-2 text-[#6c736a]">
                      📍 {profile?.city || "Location not specified"}
                    </p>
                    <p className="mt-1 break-all text-[#8b9088]">
                      {profile?.email || "Email not specified"}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#f4f1eb] px-4 py-2 text-sm text-[#5e655b]">
                        {dressCount} Dresses
                      </span>
                      <span className="rounded-full bg-[#f4f1eb] px-4 py-2 text-sm text-[#5e655b]">
                        Creator
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href="/profile/edit"
                  className="rounded-full bg-[#2f3b31] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#425043]"
                >
                  Edit Profile
                </Link>
              </div>

              <div className="mt-10 max-w-3xl">
                <h2 className="text-2xl font-medium text-[#2f312d]">My Story</h2>
                <p className="mt-4 leading-8 text-[#5c645a]">
                  {profile?.bio ||
                    "Tell buyers about yourself, your inspiration, and the story behind your creations."}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-16">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-[#ddd7cf]" />
              <span className="text-xs uppercase tracking-[0.35em] text-[#90867b]">
                Collection
              </span>
              <div className="h-px flex-1 bg-[#ddd7cf]" />
            </div>

            <h2 className="mt-8 text-4xl font-semibold text-[#2f312d]">My Dresses</h2>
            <p className="mt-2 text-[#6c736a]">
              {dressCount} handcrafted pieces shared on Atelier Folk
            </p>

            {dresses.length === 0 ? (
              <div className="mt-8 rounded-[2rem] bg-white p-12 text-center shadow-sm">
                No dresses uploaded yet.
              </div>
            ) : (
              <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {dresses.map((dress) => (
                  <CardFrame>
                    <CardImage
                      src={
                        dress.dress_images?.[0]?.image_url ||
                        "https://placehold.co/600x800?text=Dress"
                      }
                      alt={dress.title}
                      className="h-80 w-full object-cover"
                    />
                    <div className="p-5">
                      <p className="text-xs uppercase tracking-[0.25em] text-[#9d8b7a]">
                        {dress.category || "Fashion"}
                      </p>
                      <h3 className="mt-2 text-2xl font-medium text-[#2d2d2d]">{dress.title}</h3>
                      <p className="mt-2 text-[#5f675d]">₹{dress.price}</p>
                      <div className="mt-5 flex gap-2">
                        <Link
                          href={`/collections/${dress.id}`}
                          className="flex-1 rounded-xl border border-[#e4ddd4] py-3 text-center text-sm font-medium transition hover:bg-[#f5f2ed]"
                        >
                          View
                        </Link>
                        <Link
                          href={`/edit-dress/${dress.id}`}
                          className="flex-1 rounded-xl bg-[#2f3b31] py-3 text-center text-sm font-medium text-white transition hover:bg-[#425043]"
                        >
                          Edit
                        </Link>
                      </div>
                      <button
                        onClick={() => deleteDress(dress.id)}
                        className="mt-3 text-sm text-[#af6660] transition hover:text-[#9a534d]"
                      >
                        Delete listing
                      </button>
                    </div>
                  </CardFrame>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}