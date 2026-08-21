import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Coins, Loader2, Lock } from "lucide-react";
import { createCheckout } from "../features/createCheckout";

const PLANS = [
  { id: "starter", name: "Starter", credits: 60, price: "$0.99", tagline: "Try it out" },
  { id: "student", name: "Student", credits: 150, price: "$1.99", tagline: "For regular use",popular: true },
  { id: "pro", name: "Pro", credits: 300, price: "$2.99", tagline: "Best for power users" },
];

function BuyCreditsModal({ open, onClose }) {
  const { credits } = useSelector((state) => state.user);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState(null);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-90 max-w-[calc(100vw-2rem)] bg-[#13151c] border border-white/8 rounded-2xl p-6 flex flex-col gap-4 animate-[fadeUp_0.25s_ease-out_both]"
      >
        <div className="flex items-start gap-3">
          <div className="size-9 shrink-0 rounded-xl bg-indigo-500/15 border border-indigo-400/20 flex items-center justify-center text-indigo-300">
            <Coins size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Buy credits</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              You have {credits} credits.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                plan.popular
                  ? "bg-indigo-500/10 border-indigo-400/40"
                  : "bg-white/3 border-white/8 hover:border-indigo-400/40 hover:bg-white/5"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2 right-3 px-2 py-px rounded-full text-[10px] font-medium text-indigo-200 bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-sm">
                  Best value
                </span>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-100">{plan.name}</p>
                <p className="text-xs text-indigo-300 flex items-center gap-1 mt-0.5">
                  <Coins size={10} /> {plan.credits} credits
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">{plan.tagline}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <p className="text-sm font-semibold text-slate-100">{plan.price}</p>
                <button
                  disabled={loadingPlan !== null}
                  onClick={async () => {
                    setLoadingPlan(plan.id);
                    setError(null);
                    try {
                      const result = await createCheckout(plan.id);
                      if (result.url) {
                        window.location.href = result.url;
                        return;
                      }
                      setError(result.error || "Couldn't start the checkout. Please try again.");
                    } finally {
                      setLoadingPlan(null);
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-indigo-500 hover:bg-indigo-400 shadow-[0_0_16px_rgba(99,102,241,0.25)] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {loadingPlan === plan.id ? (
                    <>
                      <Loader2 size={12} className="animate-spin" /> Redirecting
                    </>
                  ) : (
                    "Buy"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-400/25 text-xs text-amber-300">
            {error}
          </div>
        )}

        <p className="flex items-center justify-center gap-1 text-[10px] text-slate-600">
          <Lock size={10} /> Payments are securely handled by Stripe.
        </p>

        <button
          onClick={onClose}
          className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default BuyCreditsModal;
