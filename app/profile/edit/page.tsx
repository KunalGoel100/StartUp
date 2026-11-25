"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SiteHeader from "@/components/SiteHeader";

export default function EditProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userId, setUserId] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/");
      return;
    }

    setUserId(user.id);

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setName(data.name || "");
      setPhone(data.phone || "");
      setCity(data.city || "");
      setBio(data.bio || "");
      setProfileImage(data.profile_image || "");
    }

    setLoading(false);
  }

  async function uploadProfileImage(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("profile-images")
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      return;
    }

    const { data } = supabase.storage
      .from("profile-images")
      .getPublicUrl(fileName);

    setProfileImage(data.publicUrl);
  }

  async function saveProfile() {
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        name,
        phone,
        city,
        bio,
        profile_image: profileImage,
      })
      .eq("id", userId);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Profile updated successfully");

    router.push("/profile");
  }

  if (loading) {
    return (
      <>
        <SiteHeader />
        <div className="p-10 text-center">
          Loading profile...
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
              Edit Profile
            </h1>

            <p className="mt-2 text-[#6c736a]">
              Update your creator profile.
            </p>

            <div className="mt-8 space-y-5">

              <div className="flex flex-col items-center gap-4">

                <img
                  src={
                    profileImage ||
                    "https://placehold.co/300x300?text=Profile"
                  }
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadProfileImage}
                />

              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-[#dfe3da] px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phone
                </label>

                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl border border-[#dfe3da] px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  City
                </label>

                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-2xl border border-[#dfe3da] px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  My Story
                </label>

                <textarea
                  rows={5}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-2xl border border-[#dfe3da] px-4 py-3"
                />
              </div>

              <button
                onClick={saveProfile}
                disabled={saving}
                className="w-full rounded-full bg-[#2f3b31] px-5 py-3 text-sm font-medium text-white"
              >
                {saving
                  ? "Saving..."
                  : "Save Profile"}
              </button>

            </div>

          </div>

        </div>
      </main>
    </>
  );
}