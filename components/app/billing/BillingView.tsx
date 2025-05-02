"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  MessageSquare,
  Receipt,
  Check,
  FileText,
  Calendar,
  BadgeCheck,
  PackageOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useCredits } from "@/hooks/use-credits";
import { useBilling } from "@/hooks/use-billing";

export function BillingView() {
  const [activeTab, setActiveTab] = useState("purchase");
  const { credits, isLoading: isLoadingCredits } = useCredits();
  const {
    questionPackages,
    resumePackages,
    paymentHistory,
    createQuestionCheckout,
    createResumeCheckout,
    isLoading,
  } = useBilling();

  const handleQuestionPackagePurchase = async (packageId: string) => {
    try {
      const result = await createQuestionCheckout.mutateAsync({ packageId });

      if (result.url) {
        // Redirect to Stripe checkout
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      toast.error("Failed to create checkout session. Please try again.");
    }
  };

  const handleResumePackagePurchase = async (packageId: string) => {
    try {
      const result = await createResumeCheckout.mutateAsync({ packageId });

      if (result.url) {
        // Redirect to Stripe checkout
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      toast.error("Failed to create checkout session. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Billing & Credits
          </h1>
          <p className="text-muted-foreground">
            Manage your interview credits and purchase history
          </p>
        </div>

        {/* Credits Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <MessageSquare className="mr-2 h-4 w-4 text-primary" />
                Interview Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">
                  {isLoadingCredits ? "..." : credits?.remainingQuestions || 0}
                </div>
                <Badge variant="outline" className="font-normal">
                  {isLoadingCredits
                    ? "..."
                    : `${credits?.totalQuestionsUsed || 0} used`}
                </Badge>
              </div>
              {!isLoadingCredits &&
                credits?.remainingQuestions !== undefined && (
                  <Progress
                    value={Math.min(
                      (credits.remainingQuestions /
                        (credits.remainingQuestions + 10)) *
                        100,
                      100
                    )}
                    className="h-2 mt-2"
                  />
                )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <FileText className="mr-2 h-4 w-4 text-primary" />
                Resume Enhancements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">
                  {isLoadingCredits ? "..." : credits?.resumeCredits || 0}
                </div>
                <Badge variant="outline" className="font-normal">
                  {isLoadingCredits
                    ? "..."
                    : `${credits?.totalResumeCreditsUsed || 0} used`}
                </Badge>
              </div>
              {!isLoadingCredits && credits?.resumeCredits !== undefined && (
                <Progress
                  value={Math.min(
                    (credits.resumeCredits / (credits.resumeCredits + 5)) * 100,
                    100
                  )}
                  className="h-2 mt-2"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="purchase">Purchase Credits</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>

          {/* Purchase Credits Tab */}
          <TabsContent value="purchase" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Question Credits</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isLoading.packages
                  ? Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <Card key={i} className="border border-border">
                          <CardHeader>
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                              <PackageOpen className="h-4 w-4 text-primary" />
                            </div>
                            <CardTitle className="text-lg">
                              Loading...
                            </CardTitle>
                            <CardDescription>Loading...</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="text-center">
                              <div className="text-3xl font-bold mb-1">$--</div>
                              <div className="text-sm text-muted-foreground">
                                One-time purchase
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button className="w-full" disabled>
                              Purchase
                            </Button>
                          </CardFooter>
                        </Card>
                      ))
                  : questionPackages?.packages?.map((pack) => (
                      <Card
                        key={pack!.id}
                        className={`border ${pack!.id === "momentum" ? "border-primary shadow-sm" : "border-border"}`}
                      >
                        <CardHeader>
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                            <PackageOpen className="h-4 w-4 text-primary" />
                          </div>
                          <CardTitle className="text-lg">
                            {pack!.name}
                          </CardTitle>
                          <CardDescription>{pack!.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold mb-1">
                              ${pack!.amount}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              One-time purchase
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span>{pack!.credits} Interview Questions</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span>
                                {pack!.resumeEnhancements} Resume Enhancements
                              </span>
                            </div>
                            {pack!.idealFor && (
                              <div className="flex items-center gap-2">
                                <BadgeCheck className="h-4 w-4 text-primary" />
                                <span className="text-sm text-muted-foreground">
                                  Ideal for: {pack!.idealFor}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            className="w-full"
                            onClick={() =>
                              handleQuestionPackagePurchase(pack!.id)
                            }
                            disabled={isLoading.checkout}
                          >
                            {isLoading.checkout ? "Processing..." : "Purchase"}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">
                Resume Enhancement Credits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isLoading.packages
                  ? Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <Card key={i} className="border border-border">
                          <CardHeader>
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <CardTitle className="text-lg">
                              Loading...
                            </CardTitle>
                            <CardDescription>Loading...</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="text-center">
                              <div className="text-3xl font-bold mb-1">$--</div>
                              <div className="text-sm text-muted-foreground">
                                One-time purchase
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button className="w-full" disabled>
                              Purchase
                            </Button>
                          </CardFooter>
                        </Card>
                      ))
                  : resumePackages?.packages?.map((pack) => (
                      <Card
                        key={pack!.id}
                        className={`border ${pack!.id === "resume-bundle-small" ? "border-primary shadow-sm" : "border-border"}`}
                      >
                        <CardHeader>
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <CardTitle className="text-lg">
                            {pack!.name}
                          </CardTitle>
                          <CardDescription>{pack!.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold mb-1">
                              ${pack!.amount}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              One-time purchase
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span>
                                {pack!.count} Resume Enhancement
                                {pack!.count !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            className="w-full"
                            onClick={() =>
                              handleResumePackagePurchase(pack!.id)
                            }
                            disabled={isLoading.checkout}
                          >
                            {isLoading.checkout ? "Processing..." : "Purchase"}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
              </div>
            </div>
          </TabsContent>

          {/* Payment History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Receipt className="mr-2 h-5 w-5 text-primary" />
                  Payment History
                </CardTitle>
                <CardDescription>
                  View all your past payments and credit purchases
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading.history ? (
                  <div className="space-y-4">
                    {Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={i}
                          className="flex justify-between p-4 border rounded-md"
                        >
                          <div className="space-y-1">
                            <div className="w-32 h-5 bg-muted rounded"></div>
                            <div className="w-24 h-4 bg-muted rounded"></div>
                          </div>
                          <div className="space-y-1 text-right">
                            <div className="w-16 h-5 bg-muted rounded ml-auto"></div>
                            <div className="w-20 h-4 bg-muted rounded ml-auto"></div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : paymentHistory?.payments &&
                  paymentHistory.payments.length > 0 ? (
                  <div className="space-y-4">
                    {paymentHistory.payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex justify-between p-4 border rounded-md hover:bg-muted/20 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="font-medium">
                            {payment.priceId.startsWith("question")
                              ? "Question Package"
                              : "Resume Package"}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(payment.createdAt), "MMM d, yyyy")}
                          </div>
                        </div>
                        <div className="space-y-1 text-right">
                          <div className="font-medium">${payment.amount}</div>
                          <div className="text-sm">
                            <Badge
                              variant={
                                payment.status === "completed"
                                  ? "default"
                                  : "destructive"
                              }
                              className={
                                payment.status === "completed"
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : ""
                              }
                            >
                              {payment.status.charAt(0).toUpperCase() +
                                payment.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                      <Receipt className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                      No payment history
                    </h3>
                    <p className="text-muted-foreground">
                      You haven&apos;t made any purchases yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
