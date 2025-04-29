"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import GoogleLogo from "@/public/icons/google.svg";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/auth/routes/routes";

export function FormSocials() {
  const onClick = (provider: "google") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => onClick("google")}
    >
      <Image src={GoogleLogo} alt="Google logo" className="size-4 mr-2" />
      Sign In with Google
    </Button>
  );
}
