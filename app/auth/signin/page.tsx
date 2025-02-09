"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg border p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold">Sign in to continue</h1>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex items-center gap-3 rounded-lg border px-6 py-3 hover:bg-gray-50"
        >
          <Image
            src="/google.svg"
            alt="Google logo"
            width={20}
            height={20}
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
} 