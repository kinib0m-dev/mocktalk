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
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  const router = useRouter();

  // Redirect to billing page after a delay
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/billing");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="container max-w-lg mx-auto flex items-center justify-center min-h-screen p-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto my-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          <p>We were unable to process your payment at this time.</p>
          <p className="text-sm text-muted-foreground">
            Your payment was not successful. Please check your payment details
            and try again.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            If you continue to experience issues, please contact our support
            team for assistance.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/support">Contact Support</Link>
          </Button>
          <Button asChild>
            <Link href="/billing">Try Again</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
