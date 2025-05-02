// lib/utils/stripe.ts

import Stripe from "stripe";

// Initialize the Stripe client with the secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil", // Use the latest API version
  appInfo: {
    name: "MockTalk",
    version: "0.1.0",
  },
});

// Format amount for Stripe (convert dollars to cents)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

// Format amount from Stripe (convert cents to dollars)
export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100;
};

// Get question credit package details
export const getQuestionPackage = (packId: string): QuestionPackage | null => {
  const packages: Record<string, QuestionPackage> = {
    kickstart: {
      id: "kickstart",
      name: "KickStart",
      description: "Perfect for first-timers and light users",
      amount: 6.0,
      credits: 5,
      resumeEnhancements: 1,
      idealFor: "First-timers, light users",
    },
    momentum: {
      id: "momentum",
      name: "Momentum",
      description: "Ideal for moderate users preparing for interviews",
      amount: 12.0,
      credits: 10,
      resumeEnhancements: 2,
      idealFor: "Moderate users",
    },
    accelerator: {
      id: "accelerator",
      name: "Accelerator",
      description: "For power users preparing deeply for interviews",
      amount: 22.0,
      credits: 20,
      resumeEnhancements: 4,
      idealFor: "Power users preparing deeply",
    },
    summit: {
      id: "summit",
      name: "Summit",
      description: "For heavy users and those receiving career coaching",
      amount: 40.0,
      credits: 40,
      resumeEnhancements: 8,
      idealFor: "Heavy users, career coaching",
    },
  };

  return packages[packId] || null;
};

// Get resume enhancement package details
export const getResumePackage = (packId: string): ResumePackage | null => {
  const packages: Record<string, ResumePackage> = {
    "resume-single": {
      id: "resume-single",
      name: "Single Resume Enhancement",
      description: "One professional resume optimization",
      amount: 2.0,
      count: 1,
    },
    "resume-bundle-small": {
      id: "resume-bundle-small",
      name: "Resume Enhancement Bundle (4)",
      description: "Four professional resume optimizations",
      amount: 7.0,
      count: 4,
    },
    "resume-bundle-large": {
      id: "resume-bundle-large",
      name: "Resume Enhancement Bundle (10)",
      description: "Ten professional resume optimizations",
      amount: 14.0,
      count: 10,
    },
  };

  return packages[packId] || null;
};

// Create a payment intent for question packages
export async function createQuestionPackagePaymentIntent(
  packId: string,
  userId: string
): Promise<Stripe.PaymentIntent | null> {
  const pack = getQuestionPackage(packId);

  if (!pack || pack.amount === 0) {
    return null;
  }

  return await stripe.paymentIntents.create({
    amount: formatAmountForStripe(pack.amount),
    currency: "usd",
    metadata: {
      userId: userId,
      packId: packId,
      packageType: "question",
      credits: String(pack.credits),
      resumeEnhancements: String(pack.resumeEnhancements),
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

// Create a payment intent for resume enhancement packages
export async function createResumePackagePaymentIntent(
  packId: string,
  userId: string
): Promise<Stripe.PaymentIntent | null> {
  const pack = getResumePackage(packId);

  if (!pack) {
    return null;
  }

  return await stripe.paymentIntents.create({
    amount: formatAmountForStripe(pack.amount),
    currency: "usd",
    metadata: {
      userId: userId,
      packId: packId,
      packageType: "resume",
      resumeEnhancementCount: String(pack.count),
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

// Create Stripe Checkout session for question packages
export async function createQuestionPackageCheckoutSession(
  packId: string,
  userId: string
): Promise<Stripe.Checkout.Session | null> {
  const pack = getQuestionPackage(packId);

  if (!pack || pack.amount === 0) {
    return null;
  }

  return await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: pack.name,
            description: pack.description,
          },
          unit_amount: formatAmountForStripe(pack.amount),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancel`,
    metadata: {
      userId: userId,
      packId: packId,
      packageType: "question",
      credits: String(pack.credits),
      resumeEnhancements: String(pack.resumeEnhancements),
    },
  });
}

// Create Stripe Checkout session for resume enhancement packages
export async function createResumePackageCheckoutSession(
  packId: string,
  userId: string
): Promise<Stripe.Checkout.Session | null> {
  const pack = getResumePackage(packId);

  if (!pack) {
    return null;
  }

  return await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: pack.name,
            description: pack.description,
          },
          unit_amount: formatAmountForStripe(pack.amount),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancel`,
    metadata: {
      userId: userId,
      packId: packId,
      packageType: "resume",
      resumeEnhancementCount: String(pack.count),
    },
  });
}
