import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CheckCircle2, XCircle } from "lucide-react";
import { getCredits } from "../features/getCredits";
import { setCredits } from "../redux/userSlice";

function PaymentResult({ success }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (success) {
      getCredits().then((data) => {
        if (data?.credits !== undefined) dispatch(setCredits(data.credits));
      });
    }

    const timer = setTimeout(() => navigate("/chat"), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-[#0d0f14] text-white px-4">
      <div className="w-80 bg-[#13151c] border border-white/8 rounded-2xl p-7 flex flex-col items-center gap-4 text-center">
        {success ? (
          <CheckCircle2 size={40} className="text-emerald-400" />
        ) : (
          <XCircle size={40} className="text-slate-500" />
        )}

        <div>
          <h2 className="text-base font-semibold text-slate-100">
            {success ? "Payment successful!" : "Payment cancelled"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {success
              ? "Your credits have been added to your account."
              : "No charge was made — you can try again anytime."}
          </p>
        </div>

        <button
          onClick={() => navigate("/chat")}
          className="w-full py-2 rounded-xl text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-400 cursor-pointer"
        >
          Back to chat
        </button>
        <p className="text-[10px] text-slate-600">Redirecting automatically…</p>
      </div>
    </div>
  );
}

export default PaymentResult;
