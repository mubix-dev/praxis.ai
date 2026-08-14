import React, { useEffect, useRef, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";
import api from "../utils/axios";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { MessageSquare, Globe, Code2, FileText, Presentation, Eye, ArrowRight } from "lucide-react";

const agents = [
  { icon: MessageSquare, name: "Chat", desc: "Natural conversation and answers", color: "text-cyan-400", orb: "radial-gradient(circle at 32% 26%, #a5f3fc, #06b6d4 55%, #164e63)" },
  { icon: Globe, name: "Search", desc: "Real-time info from the web", color: "text-emerald-400", orb: "radial-gradient(circle at 32% 26%, #6ee7b7, #10b981 55%, #064e3b)" },
  { icon: Code2, name: "Coding", desc: "Write, debug and explain code", color: "text-indigo-400", orb: "radial-gradient(circle at 32% 26%, #c7d2fe, #6d5efc 55%, #312e81)" },
  { icon: FileText, name: "PDF", desc: "Generate and analyze documents", color: "text-orange-400", orb: "radial-gradient(circle at 32% 26%, #fed7aa, #f97316 55%, #7c2d12)" },
  { icon: Presentation, name: "PPT", desc: "Build presentations in seconds", color: "text-pink-400", orb: "radial-gradient(circle at 32% 26%, #fbcfe8, #ec4899 55%, #831843)" },
  { icon: Eye, name: "Vision", desc: "Understand and generate images", color: "text-amber-400", orb: "radial-gradient(circle at 32% 26%, #fde68a, #eab308 55%, #713f12)" },
];

const showcase = [
  { agent: "CODING", color: "text-indigo-400", prompt: "Fix the auth bug in my Express app", result: "Found the middleware ordering issue and patched it." },
  { agent: "SEARCH", color: "text-emerald-400", prompt: "Latest funding news in AI startups", result: "Live results with sources, summarized." },
  { agent: "PPT", color: "text-pink-400", prompt: "Investor deck for a fintech MVP", result: "10 slides, structured and export-ready." },
  { agent: "PDF", color: "text-orange-400", prompt: "Summarize this 40-page contract", result: "Key clauses, risks and dates extracted." },
  { agent: "VISION", color: "text-amber-400", prompt: "What's wrong in this UI screenshot?", result: "Spotted contrast and alignment issues." },
  { agent: "CHAT", color: "text-cyan-400", prompt: "Explain vector databases simply", result: "Clear answer with analogies and follow-ups." },
];

/* fades content up when it scrolls into view */
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Landing() {
  const dispatch = useDispatch();

  const handleLogin = async (token) => {
    try {
      const result = await api.post("/api/auth/login", { token });
      dispatch(setUserData(result?.data));
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
    <div className="min-h-screen bg-[#0d0f14] text-white overflow-x-hidden">

      {/* soft background glows */}
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-150 h-150 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-100 h-100 rounded-full bg-cyan-500/8 blur-3xl pointer-events-none" />

      {/* navbar */}
      <nav className="relative max-w-5xl mx-auto flex items-center justify-between px-6 py-5">
        <img src="/logo.svg" alt="PraxisAI" className="h-12 w-auto" />

        {/* center links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="#agents" className="hover:text-white">Agents</a>
          <a href="#preview" className="hover:text-white">Product</a>
          <a href="#how" className="hover:text-white">How it works</a>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="px-4 py-2 rounded-lg text-sm bg-white/5 hover:bg-white/10 border border-white/8 cursor-pointer"
        >
          Sign in
        </button>
      </nav>

      {/* hero */}
      <section className="relative max-w-5xl mx-auto px-6 pt-20 pb-12 text-center flex flex-col items-center gap-6">

        {/* floating agent chips filling the hero sides */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none animate-[fadeUp_1s_ease-out_0.6s_both]">
          <div className="absolute left-4 top-28 -rotate-6 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/3 border border-white/8 text-sm text-slate-300 animate-[float_5s_ease-in-out_infinite]">
            <MessageSquare size={15} className="text-cyan-400" /> Chat
          </div>
          <div className="absolute left-0 top-1/2 rotate-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/3 border border-white/8 text-sm text-slate-300 animate-[float_6s_ease-in-out_infinite]" style={{ animationDelay: "1s" }}>
            <Globe size={15} className="text-emerald-400" /> Search
          </div>
          <div className="absolute left-10 bottom-24 -rotate-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/3 border border-white/8 text-sm text-slate-300 animate-[float_5.5s_ease-in-out_infinite]" style={{ animationDelay: "2s" }}>
            <Code2 size={15} className="text-indigo-400" /> Coding
          </div>
          <div className="absolute right-4 top-24 rotate-6 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/3 border border-white/8 text-sm text-slate-300 animate-[float_6.5s_ease-in-out_infinite]" style={{ animationDelay: "0.5s" }}>
            <FileText size={15} className="text-orange-400" /> PDF
          </div>
          <div className="absolute right-0 top-1/2 -rotate-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/3 border border-white/8 text-sm text-slate-300 animate-[float_5s_ease-in-out_infinite]" style={{ animationDelay: "1.5s" }}>
            <Presentation size={15} className="text-pink-400" /> PPT
          </div>
          <div className="absolute right-10 bottom-24 rotate-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/3 border border-white/8 text-sm text-slate-300 animate-[float_6s_ease-in-out_infinite]" style={{ animationDelay: "2.5s" }}>
            <Eye size={15} className="text-amber-400" /> Vision
          </div>
        </div>

        {/* the Praxis core — router sphere with agents in orbit */}
        <div className="relative w-52 h-52 animate-[float_6s_ease-in-out_infinite]">

          {/* orbit guide rings */}
          <div className="absolute inset-2 rounded-full border border-white/10" />
          <div className="absolute inset-2 rounded-full border border-indigo-400/15 scale-110" />

          {/* agent orbs orbiting the core */}
          <div className="absolute inset-0 animate-[spin_24s_linear_infinite]">
            {agents.map((agent, i) => (
              <div
                key={agent.name}
                className="absolute w-9 h-9 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${50 + 48 * Math.cos((i * Math.PI) / 3)}%`,
                  top: `${50 + 48 * Math.sin((i * Math.PI) / 3)}%`,
                }}
              >
                {/* counter-spin keeps each orb's lighting upright */}
                <div className="relative w-full h-full animate-[spin_24s_linear_infinite_reverse]">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: agent.orb,
                      boxShadow: "inset -3px -4px 8px rgba(0,0,0,0.45), 0 6px 16px rgba(0,0,0,0.4)",
                    }}
                  />
                  <div className="absolute top-1 left-2 w-3.5 h-1.5 rounded-full bg-white/40 blur-[1px]" />
                  <agent.icon size={14} className="absolute inset-0 m-auto text-white/90" />
                </div>
              </div>
            ))}
          </div>

          {/* glossy router core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_26%,#c7d2fe,#6d5efc_55%,#312e81)] shadow-[inset_-6px_-8px_16px_rgba(0,0,0,0.45),0_0_50px_16px_rgba(109,94,252,0.35)]" />
              <div className="absolute top-2.5 left-4 w-7 h-3.5 rounded-full bg-white/45 blur-[2px]" />
            </div>
          </div>
        </div>

        <span className="relative px-3 py-1 rounded-full text-xs text-indigo-300 bg-indigo-400/10 border border-indigo-400/20 animate-[fadeUp_0.7s_ease-out_both]">
          Multi-Agent AI Platform
        </span>

        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight animate-[fadeUp_0.7s_ease-out_0.1s_both]">
          One prompt.
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent bg-size-[200%_auto] animate-[shimmer_5s_linear_infinite]">
            Every specialist.
          </span>
        </h1>

        <p className="max-w-xl text-slate-400 text-base md:text-lg animate-[fadeUp_0.7s_ease-out_0.2s_both]">
          Praxis reads your intent and routes it to the right AI agent
          for the job — no model picking, no tab switching.
          You just ask.
        </p>

        {/* cycling example prompts — one per agent */}
        <div className="relative h-6 w-full text-sm text-slate-500 animate-[fadeUp_0.7s_ease-out_0.3s_both]">
          {[
            '"Debug my React code"',
            '"What’s trending in AI today?"',
            '"Summarize this PDF"',
            '"Build me a pitch deck"',
            '"What’s in this image?"',
            '"Explain quantum computing"',
          ].map((text, i) => (
            <span
              key={text}
              className="absolute inset-0 opacity-0 animate-[cycle_15s_linear_infinite]"
              style={{ animationDelay: `${i * 2.5}s` }}
            >
              {text}
            </span>
          ))}
        </div>

        <button
          onClick={handleGoogleLogin}
          className="mt-2 flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-medium text-black/90 bg-white hover:bg-gray-200 cursor-pointer animate-[fadeUp_0.7s_ease-out_0.4s_both]"
        >
          <FcGoogle size={20} />
          Continue with Google
          <ArrowRight size={16} />
        </button>
        <p className="text-xs text-slate-600 animate-[fadeUp_0.7s_ease-out_0.5s_both]">Free plan available. No card required.</p>

        {/* stats strip */}
        <div className="flex items-center gap-6 mt-4 text-xs text-slate-500 animate-[fadeUp_0.7s_ease-out_0.6s_both]">
          <span><span className="text-slate-200 font-medium">Auto</span> agent routing</span>
          <span className="w-px h-4 bg-white/10" />
          <span><span className="text-slate-200 font-medium">0</span> setup needed</span>
          <span className="w-px h-4 bg-white/10" />
          <span><span className="text-slate-200 font-medium">Free</span> to start</span>
        </div>
      </section>

      {/* 3D app preview */}
      <section id="preview" className="relative max-w-4xl mx-auto px-6 pb-24 perspective-distant">
        <div className="rounded-2xl border border-white/10 bg-[#101218] shadow-2xl shadow-indigo-500/15 overflow-hidden transform-[rotateX(10deg)] hover:transform-[rotateX(2deg)] transition-transform duration-700 animate-[float_7s_ease-in-out_infinite]">
          {/* window bar */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8">
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          </div>
          <div className="flex h-72 text-left">
            {/* fake sidebar */}
            <div className="hidden sm:flex w-44 shrink-0 border-r border-white/8 flex-col gap-1 p-4 text-xs">
              <div className="px-2 py-1.5 rounded-lg bg-white/10 text-slate-300 text-center mb-2">+ New Chat</div>
              <p className="text-[9px] text-slate-600 tracking-widest mb-1">RECENT</p>
              <div className="px-2 py-1.5 rounded bg-indigo-500/20 text-indigo-200 truncate">Solar pitch deck</div>
              <div className="px-2 py-1.5 rounded text-slate-500 truncate">Fix auth bug</div>
              <div className="px-2 py-1.5 rounded text-slate-500 truncate">Q3 report summary</div>
            </div>
            {/* fake chat */}
            <div className="flex-1 flex flex-col p-5 gap-3 text-xs md:text-sm">
              <div className="self-end max-w-[75%] px-3 py-2 rounded-xl rounded-br-sm bg-indigo-500/25 text-indigo-100">
                Build me a pitch deck about solar energy 🌞
              </div>
              <div className="self-start max-w-[80%] px-3 py-2 rounded-xl rounded-bl-sm bg-white/5 text-slate-300">
                <span className="text-pink-400 text-[10px] tracking-wide">PPT AGENT</span>
                <br />
                Done! 10 slides covering market size, cost trends and your
                go-to-market — ready to download.
              </div>
              <div className="self-end max-w-[75%] px-3 py-2 rounded-xl rounded-br-sm bg-indigo-500/25 text-indigo-100">
                Now find the latest solar subsidy news
              </div>
              <div className="self-start max-w-[80%] px-3 py-2 rounded-xl rounded-bl-sm bg-white/5 text-slate-300">
                <span className="text-emerald-400 text-[10px] tracking-wide">SEARCH AGENT</span>
                <br />
                3 fresh results — the new credit scheme was announced today…
              </div>
              <div className="mt-auto flex items-center px-3 h-10 rounded-xl border border-white/10 bg-white/2 text-slate-600">
                Ask anything…
              </div>
            </div>
          </div>
        </div>
        {/* glow under the panel */}
        <div className="mx-auto -mt-6 w-3/4 h-12 rounded-full bg-indigo-600/20 blur-2xl pointer-events-none" />
      </section>

      {/* agents grid */}
      <section id="agents" className="relative max-w-5xl mx-auto px-6 pb-24 scroll-mt-8">
        <Reveal>
          <p className="text-center text-xs text-slate-500 tracking-widest mb-8">MEET THE AGENTS</p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent, i) => (
            <Reveal key={agent.name} delay={i * 100}>
              <div className="p-5 rounded-2xl bg-white/2 border border-white/8 hover:bg-white/5 flex flex-col gap-2 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/15 hover:shadow-lg hover:shadow-indigo-500/10">
                <agent.icon size={20} className={agent.color} />
                <p className="font-medium">{agent.name}</p>
                <p className="text-sm text-slate-500">{agent.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* scrollable showcase */}
      <section className="relative pb-24">
        <Reveal>
          <p className="text-center text-xs text-slate-500 tracking-widest mb-8">SEE IT IN ACTION</p>
        </Reveal>
        <Reveal delay={100}>
          {/* fade masks on the edges */}
          <div className="relative overflow-hidden max-w-5xl mx-auto mask-x-from-90% mask-x-to-100%">
            <div className="flex gap-4 w-max px-6 pb-4 animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused]">
              {[...showcase, ...showcase].map((item, i) => (
                <div
                  key={`${item.agent}-${i}`}
                  className="shrink-0 w-72 p-5 rounded-2xl bg-white/2 border border-white/8 hover:border-white/15 transition-colors"
                >
                  <span className={`text-[10px] tracking-widest ${item.color}`}>{item.agent}</span>
                  <p className="mt-3 text-sm text-indigo-100">"{item.prompt}"</p>
                  <p className="mt-2 text-xs text-slate-500">{item.result}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-slate-600 mt-3">hover to pause</p>
        </Reveal>
      </section>

      {/* how it works */}
      <section id="how" className="relative max-w-3xl mx-auto px-6 pb-24 text-center scroll-mt-8">
        <Reveal>
          <p className="text-xs text-slate-500 tracking-widest mb-8">HOW IT WORKS</p>
        </Reveal>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
          <Reveal delay={0}>
            <div className="px-5 py-3 rounded-xl bg-white/2 border border-white/8">1 · Ask anything</div>
          </Reveal>
          <ArrowRight size={16} className="text-slate-600 rotate-90 md:rotate-0" />
          <Reveal delay={150}>
            <div className="px-5 py-3 rounded-xl bg-white/2 border border-white/8">2 · Praxis picks the agent</div>
          </Reveal>
          <ArrowRight size={16} className="text-slate-600 rotate-90 md:rotate-0" />
          <Reveal delay={300}>
            <div className="px-5 py-3 rounded-xl bg-white/2 border border-white/8">3 · Get the result</div>
          </Reveal>
        </div>
      </section>

      {/* footer */}
      <footer className="relative border-t border-white/8 py-8 text-center text-xs text-slate-600">
        PraxisAI — theory into action.
      </footer>
    </div>
  );
}

export default Landing;
