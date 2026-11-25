"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import SiteHeader from "@/components/SiteHeader";
import ProductDetail from "@/components/ProductDetail";
import { supabase } from "@/lib/supabase";

export default function CollectionPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadDress();
    }
  }, [id]);

  async function loadDress() {
    const { data: dress, error } = await supabase
      .from("dresses")
      .select(`
        *,
        dress_images (
          image_url
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    const { data: seller } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", dress.seller_id)
      .single();

    setProduct({
      id: dress.id,

      title: dress.title,

      subtitle: "Handcrafted by an independent creator",

      description: dress.description,

      category: dress.category || "Fashion",

      price: `₹${dress.price}`,

      leadTime:
        dress.lead_time ||
        "Ready to ship",

      sizes:
        dress.sizes
          ?.split(",")
          .map((size: string) => size.trim()) ||
        ["M"],

      material:
        dress.material ||
        "Not specified",

      fit: "Regular Fit",

      care: "Hand Wash",

      story:
        dress.story ||
        dress.description,

      maker: seller?.name || "Unknown Seller",

      city: seller?.city || "India",

      gallery:
        dress.dress_images?.map((img: any) => ({
          image_url: img.image_url,
        })) || [],
    });
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f8f7f3]">
        <SiteHeader />
        <div className="p-10 text-center">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f7f3] text-[#252823]">
      <SiteHeader />
      <ProductDetail product={product} />
    </main>
  );
}