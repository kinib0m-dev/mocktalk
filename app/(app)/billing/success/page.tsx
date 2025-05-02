"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();

  // Redirect to dashboard after a delay
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="container max-w-lg mx-auto flex items-center justify-center min-h-screen p-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto my-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Processing</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          <p>Thank you for your purchase! Your payment is being processed.</p>
          <p className="text-sm text-muted-foreground">
            Your credits will be added to your account shortly. You will be
            redirected to your dashboard in a few seconds.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            If your credits don&apos;t appear in your account within a few
            minutes, please contact support.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/billing">Back to Billing</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
