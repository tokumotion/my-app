'use client';

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <Link
        href="/dashboards"
        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
      >
        <Image
          className="dark:invert mr-2"
          src="/key.svg"
          alt="API Key icon"
          width={20}
          height={20}
        />
        Manage API Keys
      </Link>
    );
  }

  return (
    <button
      onClick={() => signIn('google')}
      className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
    >
      <Image
        className="dark:invert mr-2"
        src="/google.svg"
        alt="Google icon"
        width={20}
        height={20}
      />
      Log in
    </button>
  );
} 