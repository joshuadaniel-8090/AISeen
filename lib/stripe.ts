import Stripe from "stripe";
import sql from "./db";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function getOrCreateStripeCustomer(
  userId: string,
  email: string
): Promise<string> {
  const rows = await sql`SELECT stripe_customer_id FROM users WHERE id = ${userId}`;
  const existing = rows[0]?.stripe_customer_id;
  if (existing) return existing;

  const customer = await stripe.customers.create({ email, metadata: { userId } });
  await sql`UPDATE users SET stripe_customer_id = ${customer.id} WHERE id = ${userId}`;
  return customer.id;
}

export function getPriceId(plan: "indie" | "pro"): string {
  if (plan === "indie") return process.env.STRIPE_INDIE_PRICE_ID!;
  return process.env.STRIPE_PRO_PRICE_ID!;
}
