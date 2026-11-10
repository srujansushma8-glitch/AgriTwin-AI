"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AuthPortal } from "@/components/auth-portal";
import { AuthLoginResponse } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const handleAuthenticated = (auth: AuthLoginResponse) => {
    try {
      localStorage.setItem("agritwin_token", auth.access_token);
      localStorage.setItem("agritwin_user", JSON.stringify(auth));
    } catch {}
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F4EB]">
      <AuthPortal onAuthenticated={handleAuthenticated} />
    </div>
  );
}
