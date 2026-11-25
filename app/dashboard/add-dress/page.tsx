"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddDress() {
  const [user, setUser] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  }

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
  async function saveDress() {
    if (!user) {
      alert("Please login first");
      return;
    }

    const { data, error } = await supabase
      .from("dresses")
      .insert({
        seller_id: user.id,
        title,
        description,
        price: Number(price),
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    await uploadImages(data.id);

    alert("Dress Added Successfully");
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add Dress</h1>

      <p>
        Logged in as: <strong>{user?.email}</strong>
      </p>

      <br />

      <input
        type="text"
        placeholder="Dress Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "300px",
          padding: "10px",
        }}
      />

      <br />
      <br />

      <textarea
        placeholder="Dress Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={5}
        style={{
          width: "300px",
          padding: "10px",
        }}
      />

      <br />
      <br />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{
          width: "300px",
          padding: "10px",
        }}
      />

      <br />
      <br />
      <input
      type="file"
      multiple
      accept="image/*"
      onChange={(e) =>
        setImages(Array.from(e.target.files || []))
      }
    />
      <button
        onClick={saveDress}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Save Dress
      </button>
    </div>
  );
}