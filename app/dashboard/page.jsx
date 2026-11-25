"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setEmail(user?.email || "");
  }

  return (
    <div>
      <h1>Seller Dashboard</h1>
      <p>{email}</p>
    </div>
  );
}