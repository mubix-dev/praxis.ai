import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";
import api from "../utils/axios";
import { FcGoogle } from "react-icons/fc";

function Home() {
  const handleLogin = async (token) => {
    try {
      const result = await api.post("/api/auth/login", { token });
      console.log(result?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      await handleLogin(token);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-screen flex bg-[#0d0f14] text-white overflow-hidden ">
      yuhjhjbn
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="w-85 bg-[#13151c] border border-white/8 rounded-2xl p-7 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 className=" text-[17px] font-semibold text-slate-100 tracking-tight">
              Welcome to PraxisAI
            </h2>
            <p className="text-[13px] text-slate-500">
              Please Login to continue using app
            </p>
          </div>
          <button className="w-full flex items-center justify-center gap-3 py-2.75 rounded-xl text-sm font-medium text-black/90 bg-white hover:bg-gray-200 cursor-pointer" onClick={handleGoogleLogin}>
            <FcGoogle size={20} className="text-white" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
