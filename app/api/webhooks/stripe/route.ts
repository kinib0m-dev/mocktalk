import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/utils/stripe";
import { db } from "@/db";
import { paymentHistory } from "@/db/schema";
import {
  addQuestionCredits,
  addResumeCredits,
} from "@/lib/auth/helpers/credits";

// Set edge runtime to bypass some Next.js middleware
export const runtime = "edge";

// Record a payment in payment history
async function recordPaymentTransaction(
  userId: string,
  stripeSessionId: string,
  stripeCustomerId: string,
  amount: number,
  priceId: string,
  questionCreditsAdded: number,
  resumeCreditsAdded: number,
  status: string
): Promise<void> {
  try {
    await db.insert(paymentHistory).values({
      userId,
      stripeSessionId,
      stripeCustomerId,
      amount,
      currency: "usd",
      priceId,
      questionCreditsAdded,
      resumeCreditsAdded,
      status,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error(
      `Error recording payment: ${error instanceof Error ? error.message : String(error)}`
    );
    throw error;
  }
}

// Webhook POST handler
export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log("Stripe webhook received");

  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("No stripe-signature header found");
      return NextResponse.json(
        { error: "No stripe-signature header" },
        { status: 400 }
      );
    }

    // Verify webhook signature from Stripe
    let event: Stripe.Event;
    try {
      if (!process.env.STRIPE_WEBHOOK_SECRET) {
        throw new Error("STRIPE_WEBHOOK_SECRET is not defined");
      }

      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error(`Webhook signature verification failed: ${errorMessage}`);
      return NextResponse.json(
        { error: `Webhook Error: ${errorMessage}` },
        { status: 400 }
      );
    }

    // Process different event types
    try {
      switch (event.type) {
        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const metadata = paymentIntent.metadata;
          const userId = metadata?.userId;
          const packageType = metadata?.packageType;
          const packId = metadata?.packId;

          if (!userId || !packageType) {
            console.warn(
              "Missing userId or packageType in payment_intent.succeeded metadata"
            );
            break;
          }

          const stripeCustomerId =
            (paymentIntent.customer as string) || "cus_unknown";
          const questionCredits = Number(metadata?.credits) || 0;
          const resumeCredits =
            Number(metadata?.resumeEnhancementCount) ||
            Number(metadata?.resumeEnhancements) ||
            0;

          await recordPaymentTransaction(
            userId,
            paymentIntent.id,
            stripeCustomerId,
            paymentIntent.amount / 100,
            packId || "unknown_price",
            packageType === "question" ? questionCredits : 0,
            resumeCredits,
            "completed"
          );

          if (packageType === "question" && questionCredits > 0) {
            await addQuestionCredits(userId, questionCredits);
          }

          if (resumeCredits > 0) {
            await addResumeCredits(userId, resumeCredits);
          }

          console.log(
            `Successfully processed payment_intent.succeeded for user ${userId}`
          );
          break;
        }

        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const metadata = session.metadata;
          const userId = metadata?.userId;
          const packageType = metadata?.packageType;

          if (!userId || !packageType) {
            console.warn(
              "Missing userId or packageType in checkout.session.completed metadata"
            );
            break;
          }

          const stripeCustomerId =
            (session.customer as string) || "cus_unknown";
          const questionCredits = Number(metadata?.credits) || 0;
          const resumeCredits =
            Number(metadata?.resumeEnhancementCount) ||
            Number(metadata?.resumeEnhancements) ||
            0;

          await recordPaymentTransaction(
            userId,
            session.id,
            stripeCustomerId,
            (session.amount_total || 0) / 100,
            metadata.packId || "unknown_price",
            packageType === "question" ? questionCredits : 0,
            resumeCredits,
            "completed"
          );

          if (packageType === "question" && questionCredits > 0) {
            await addQuestionCredits(userId, questionCredits);
          }

          if (resumeCredits > 0) {
            await addResumeCredits(userId, resumeCredits);
          }

          console.log(
            `Successfully processed checkout.session.completed for user ${userId}`
          );
          break;
        }

        case "payment_intent.payment_failed": {
          const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
          const metadata = failedPaymentIntent.metadata;
          const userId = metadata?.userId;
          const packId = metadata?.packId;

          if (userId) {
            const stripeCustomerId =
              (failedPaymentIntent.customer as string) || "cus_unknown";

            await recordPaymentTransaction(
              userId,
              failedPaymentIntent.id,
              stripeCustomerId,
              failedPaymentIntent.amount / 100,
              packId || "unknown_price",
              0,
              0,
              "failed"
            );

            console.log(`Recorded failed payment for user ${userId}`);
          } else {
            console.warn(
              "Missing userId in payment_intent.payment_failed metadata"
            );
          }

          break;
        }

        // Additional event types for single purchases
        case "charge.succeeded": {
          const charge = event.data.object as Stripe.Charge;
          const paymentIntentId = charge.payment_intent as string;

          // Only process if we haven't already processed the payment_intent.succeeded event
          // This is to avoid duplicate credits if both events fire
          if (paymentIntentId) {
            console.log(
              `Charge succeeded for payment intent ${paymentIntentId}`
            );
            // We don't need to add credits here as we already do it in payment_intent.succeeded
          }

          break;
        }

        case "charge.failed": {
          const charge = event.data.object as Stripe.Charge;
          const paymentIntentId = charge.payment_intent as string;

          if (paymentIntentId) {
            console.log(`Charge failed for payment intent ${paymentIntentId}`);
            // We don't need additional handling as we already handle payment_intent.payment_failed
          }

          break;
        }

        case "payment_method.attached": {
          // You could track payment methods attached to customers
          const paymentMethod = event.data.object as Stripe.PaymentMethod;
          const customerId = paymentMethod.customer as string;

          // This might be useful for analytics
          console.log(
            `Payment method ${paymentMethod.id} attached to customer ${customerId}`
          );
          break;
        }

        case "payment_method.detached": {
          // Track when payment methods are removed
          const paymentMethod = event.data.object as Stripe.PaymentMethod;

          console.log(`Payment method ${paymentMethod.id} detached`);
          break;
        }

        case "price.created":
        case "price.updated":
        case "price.deleted": {
          // You might want to sync your prices with Stripe
          const price = event.data.object as Stripe.Price;
          console.log(`Price ${event.type}: ${price.id}`);
          // Implement logic to sync with your database if needed
          break;
        }

        case "product.created":
        case "product.updated":
        case "product.deleted": {
          // You might want to sync your products with Stripe
          const product = event.data.object as Stripe.Product;
          console.log(`Product ${event.type}: ${product.id}`);
          // Implement logic to sync with your database if needed
          break;
        }

        case "radar.early_fraud_warning.created": {
          // Handle potential fraud warnings
          const fraudWarning = event.data.object;
          console.warn(`Fraud warning for charge: ${fraudWarning.charge}`);
          // Add logic to flag the account or payment
          break;
        }

        default:
          console.log(`⚠️ Unhandled event type: ${event.type}`);
      }
    } catch (err) {
      console.error("Error handling webhook event:", err);
      // Still return 200 to Stripe so they don't retry
      // But log the error for our monitoring
    }

    // Always return 200 to Stripe to acknowledge receipt
    // Make sure there are no redirect headers
    return NextResponse.json(
      { received: true },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Unexpected error in webhook handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
