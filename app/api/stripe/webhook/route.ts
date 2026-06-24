import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { updateUserPlan } from "@/lib/db";
import Stripe from "stripe";

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;
    const customerId = session.customer as string;

    if (userId && plan) {
      await updateUserPlan(userId, plan, customerId);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;
    // Downgrade to free by customer ID
    const customers = await stripe.customers.list({ email: undefined });
    // Use customer metadata to find user
    const customer = await stripe.customers.retrieve(customerId);
    if (!customer.deleted) {
      const userId = (customer as Stripe.Customer).metadata?.userId;
      if (userId) await updateUserPlan(userId, "free");
    }
  }

  return NextResponse.json({ received: true });
}
