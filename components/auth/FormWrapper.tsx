"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FormSocials } from "./FormSocials";
import Image from "next/image";

export function FormWrapper({
  children,
  label,
  showSocials,
  buttonHref,
  buttonLabel,
}: FormWrapperProps) {
  return (
    <Card className="min-w-[400px] shadow-md">
      <CardHeader>
        <div className="w-full flex flex-col gap-y-2 items-center justify-center">
          <Image
            src="/icons/logo-full.svg"
            alt="MockTalk"
            width={250}
            height={75}
            priority
          />
          <p className="text-muted-foreground text-sm">{label}</p>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocials && (
        <CardFooter>
          <FormSocials />
        </CardFooter>
      )}
      <CardFooter>
        <Button variant="link" className="w-full" size="sm" asChild>
          <Link href={buttonHref}>{buttonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
