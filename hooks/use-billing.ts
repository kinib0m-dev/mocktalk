"use client";

import { trpc } from "@/trpc/client";
import { useEffect, useState } from "react";

export function useBilling() {
  const [isLoading, setIsLoading] = useState({
    packages: false,
    checkout: false,
    history: false,
  });

  // Get question packages
  const { data: questionPackages, isLoading: isLoadingQuestionPackages } =
    trpc.billing.getQuestionPackages.useQuery();

  // Get resume packages
  const { data: resumePackages, isLoading: isLoadingResumePackages } =
    trpc.billing.getResumePackages.useQuery();

  // Get payment history
  const { data: paymentHistory, isLoading: isLoadingPaymentHistory } =
    trpc.billing.getPaymentHistory.useQuery();

  // Create checkout for question package
  const createQuestionCheckout =
    trpc.billing.createQuestionPackageCheckout.useMutation({
      onMutate: () => {
        setIsLoading((prev) => ({ ...prev, checkout: true }));
      },
      onSettled: () => {
        setIsLoading((prev) => ({ ...prev, checkout: false }));
      },
    });

  // Create checkout for resume package
  const createResumeCheckout =
    trpc.billing.createResumePackageCheckout.useMutation({
      onMutate: () => {
        setIsLoading((prev) => ({ ...prev, checkout: true }));
      },
      onSettled: () => {
        setIsLoading((prev) => ({ ...prev, checkout: false }));
      },
    });

  // Update loading states based on query statuses
  useEffect(() => {
    setIsLoading({
      packages: isLoadingQuestionPackages || isLoadingResumePackages,
      checkout: false,
      history: isLoadingPaymentHistory,
    });
  }, [
    isLoadingQuestionPackages,
    isLoadingResumePackages,
    isLoadingPaymentHistory,
  ]);

  return {
    questionPackages,
    resumePackages,
    paymentHistory,
    createQuestionCheckout,
    createResumeCheckout,
    isLoading,
  };
}
