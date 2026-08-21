import Stripe from "stripe";
import Credits from "../models/credits.model.js";

let stripe;
const getStripe = () => {
  if (!stripe) stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripe;
};

const PLANS = {
  starter: { amount: 99, credits: 60 },
  student: { amount: 199, credits: 150 },
  pro: { amount: 299, credits: 300 },
};

const MAX_CREDITS = 500;

const getCredits = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res
        .status(400)
        .json({ message: "Unauthorized: Missing user ID header" });
    }
    const userCredits = await Credits.findOneAndUpdate(
      { userId },
      {},
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return res.status(200).json({ credits: userCredits.credits });
  } catch (error) {
    console.log("getCredits error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deductCredits = async (req, res) => {
  try {
    if (req.headers["x-internal-key"] !== process.env.INTERNAL_API_KEY) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { cost } = req.body;
    const userId = req.headers["x-user-id"];
    if (!userId)
      return res.status(400).json({ message: "Missing user ID header" });
    if (!Number.isFinite(cost) || cost <= 0)
      return res.status(400).json({ message: "Invalid cost" });

    // the work is already done by the time we're called, so charge what the
    // user has (floored at 0) instead of failing and giving the response free
    let userCredits = await Credits.findOneAndUpdate(
      { userId, credits: { $gte: cost } },
      { $inc: { credits: -cost } },
      { new: true },
    );

    if (!userCredits) {
      // balance below cost: take whatever is left
      userCredits = await Credits.findOneAndUpdate(
        { userId },
        { $set: { credits: 0 } },
        { new: true },
      );
    }

    if (!userCredits) {
      return res.status(402).json({ message: "Insufficient Credits" });
    }

    return res.status(200).json({ remaining: userCredits.credits });
  } catch (error) {
    console.log("deductCredits error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const checkout = async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = PLANS[planId];

    if (!plan) {
      return res.status(400).json({ message: "Invalid Plan!" });
    }

    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res
        .status(400)
        .json({ message: "Unauthorized: Missing user ID header" });
    }

    const userCredits = await Credits.findOne({ userId });
    const current = userCredits?.credits ?? 50;

    if (current + plan.credits > MAX_CREDITS) {
      return res.status(400).json({
        message: `Credit limit reached — you have ${current} credits and cannot hold more than ${MAX_CREDITS}. Use some credits before buying more.`,
      });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment/success`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancelled`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan.credits} Credits`,
            },
            unit_amount: plan.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
        credits: plan.credits,
      },
    });
    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.log("checkout error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const stripeWebhook = async (req, res) => {
  try {
    const stripe = getStripe();
    const signature = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const creditsToAdd = Number(session.metadata.credits);

      if (userId && creditsToAdd) {
        await Credits.findOneAndUpdate(
          { userId },
          { $inc: { credits: creditsToAdd } },
          { upsert: true },
        );
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.log("stripeWebhook error:", error.message);
    return res.status(400).json({ message: "Webhook error" });
  }
};

export { getCredits, deductCredits, checkout,stripeWebhook };
