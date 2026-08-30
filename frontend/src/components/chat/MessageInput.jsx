import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paperclip,
  Mic,
  SendHorizontal,
  Sparkles,
  MessageSquare,
  Globe,
  Code2,
  FileText,
  Presentation,
  Eye,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../features/sendMessage";
import { getCredits } from "../../features/getCredits.js";
import { setCredits } from "../../redux/userSlice";
import { addMessage, setThinking } from "../../redux/messageSlice";
import {
  addConversation,
  updateConversationTitle,
} from "../../redux/conversationSlice.js";
import { createConversation } from "../../features/createConversation.js";
import { generateTitle } from "../../features/generateTitle.js";
const agents = [
  {
    name: "auto",
    label: "Auto",
    icon: Sparkles,
    color: "text-indigo-300",
    desc: "Picks the best agent for your request automatically.",
    cost: "2–5 credits (based on the agent chosen)",
    note: "Attached files route to the right analyzer on their own.",
  },
  {
    name: "chat",
    label: "Chat",
    icon: MessageSquare,
    color: "text-cyan-400",
    desc: "General questions, explanations and conversation.",
    cost: "2 credits per response",
    note: "Every response costs credits — even a simple “hi”.",
  },
  {
    name: "search",
    label: "Search",
    icon: Globe,
    color: "text-emerald-400",
    desc: "Live answers from the web — news, prices, current events.",
    cost: "3 credits per response",
    note: "Best for questions that need up-to-date info.",
  },
  {
    name: "coding",
    label: "Coding",
    icon: Code2,
    color: "text-indigo-400",
    desc: "Builds apps & components with live preview, debugs and reviews code.",
    cost: "5 credits per response",
    note: "Generated projects open in the artifact panel.",
  },
  {
    name: "pdf",
    label: "PDF",
    icon: FileText,
    color: "text-orange-400",
    desc: "Generates PDF documents, or answers questions about an uploaded PDF.",
    cost: "5 credits per response",
    note: "Attach a PDF with 📎 to ask about its content.",
  },
  {
    name: "ppt",
    label: "PPT",
    icon: Presentation,
    color: "text-pink-400",
    desc: "Creates downloadable PowerPoint presentations.",
    cost: "5 credits per response",
    note: "Download links expire in 24 hours.",
  },
  {
    name: "vision",
    label: "Vision",
    icon: Eye,
    color: "text-amber-400",
    desc: "Generates realistic images, or analyzes an uploaded image.",
    cost: "5 credits per response",
    note: "Attach an image with 📎 to have it analyzed.",
  },
];

const AGENT_COSTS = {
  chat: 2,
  search: 3,
  coding: 5,
  pdf: 5,
  ppt: 5,
  vision: 5,
};
const MIN_COST = Math.min(...Object.values(AGENT_COSTS));

const FILE_AGENTS = ["auto", "pdf", "vision"];
const IMAGE_AGENTS = ["auto", "vision"];
const PDF_AGENTS = ["auto", "pdf"];

function MessageInput({ suggestion }) {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { credits } = useSelector((state) => state.user);
  const [text, setText] = useState("");
  const [agent, setAgent] = useState("auto");
  const [creditError, setCreditError] = useState(false);
  const [file, setFile] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [attachOpen, setAttachOpen] = useState(false);
  const imageRef = useRef(null);
  const pdfRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (suggestion) setText(suggestion);
  }, [suggestion]);

  useEffect(() => {
    if (!attachOpen) return;
    const close = () => setAttachOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [attachOpen]);

  const handleSendMessage = async () => {
    const required =
      agent === "auto" ? MIN_COST : (AGENT_COSTS[agent] ?? MIN_COST);
    if ((credits ?? 0) < required) {
      setCreditError(true);
      return;
    }
    setCreditError(false);
    setShowPreview(false)
    dispatch(setThinking(agent));
    try {
      let conversation = selectedConversation;
      if (!conversation) {
        const newConversation = await createConversation();
        dispatch(addConversation(newConversation));
        navigate(`/chat/${newConversation._id}`);
        conversation = newConversation;
      }

      if (conversation?.title === "New Chat") {
        generateTitle(text, conversation._id).then((title) => {
          if (title)
            dispatch(
              updateConversationTitle({
                conversationId: conversation._id,
                title,
              }),
            );
        });
      }

      dispatch(
        addMessage({
          role: "user",
          content: file ? `${text}\n\n📎 *${file.name}*` : text,
        }),
      );
      setText("");
      const data = await sendMessage(text, conversation?._id, agent, file);
      setFile(null);

      const userCredits = await getCredits();
      dispatch(setCredits(userCredits?.credits));

      dispatch(setThinking(false));
      const content =
        data?.answer ??
        (data?.error === "Insufficient credits"
          ? "You don't have enough credits for this request. Top up from **Settings → Buy Credits** to continue."
          : "Something went wrong while generating a response. Please try again.");
      dispatch(
        addMessage({
          role: "assistant",
          content,
          images: data?.images,
          artifact: data?.artifact,
        }),
      );
    } catch (error) {
      dispatch(setThinking(false));
      console.log(error);
      setText("");
    }
  };

  return (
    <div className="w-full mx-auto flex flex-col items-center py-4 px-4 pb-4 shrink-0 shadow-2xl shadow-black">
      <div className="w-full max-w-3xl flex flex-wrap items-center gap-1.5 mb-2">
        {agents.map((a) => (
          <button
            key={a.name}
            onClick={() => {
              setAgent(a.name);
              setCreditError(false);

              if (file) {
                const allowed = file.type.startsWith("image/")
                  ? IMAGE_AGENTS
                  : PDF_AGENTS;
                if (!allowed.includes(a.name)) setFile(null);
              }
            }}
            className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs cursor-pointer border transition-colors ${
              agent === a.name
                ? "bg-indigo-500/15 border-indigo-400/30 text-indigo-200"
                : "bg-white/3 border-white/8 text-slate-400 hover:bg-white/5"
            }`}
          >
            <a.icon size={13} className={a.color} />
            {a.label}

            {/* hover info card */}
            <div className="absolute bottom-full left-0 mb-2 w-56 p-3 rounded-xl bg-[#13151c] border border-white/10 shadow-lg text-left opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-30">
              <p className="text-xs font-medium text-slate-100">{a.label}</p>
              <p className="text-[11px] text-slate-400 mt-1">{a.desc}</p>
              <p className="text-[11px] text-indigo-300 mt-1.5 flex items-center gap-1">
                💰 {a.cost}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">{a.note}</p>
            </div>
          </button>
        ))}
      </div>

      {creditError && (
        <div className="w-full max-w-3xl mb-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-400/25 text-xs text-amber-300">
          Not enough credits for this request — open{" "}
          <span className="font-medium">Settings → Buy Credits</span> to top up.
        </div>
      )}

      {file && showPreview && (
        <div className="w-full max-w-3xl mb-2">
          <div className="w-50 h-15 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
            {file.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(file)}
                className="h-10 w-10 rounded-lg object-cover shrink-0"
                alt=""
              />
            ) : (
              <div className="h-10 w-10 rounded-lg bg-orange-400/10 flex items-center justify-center shrink-0">
                <FileText size={18} className="text-orange-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="truncate">{file.name}</p>
              <p className="text-[10px] text-slate-500">
                {file.size < 1024 * 1024
                  ? `${(file.size / 1024).toFixed(1)} KB`
                  : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
              </p>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-slate-500 hover:text-white cursor-pointer shrink-0"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl flex items-end gap-1 px-2 py-2 rounded-2xl bg-white/5 border border-white/8 focus-within:border-white/15">
        <input
          ref={imageRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            setFile(e.target.files[0] || null);
            setShowPreview(true)
            e.target.value = "";
          }}
        />
        <input
          ref={pdfRef}
          type="file"
          accept=".pdf,application/pdf"
          hidden
          onChange={(e) => {
            setFile(e.target.files[0] || null);
            setShowPreview(true)
            e.target.value = "";
          }}
        />

        <div className="relative">
          <button
            title={
              FILE_AGENTS.includes(agent)
                ? "Attach a file"
                : "This agent doesn't accept files"
            }
            disabled={!FILE_AGENTS.includes(agent)}
            onClick={(e) => {
              e.stopPropagation();
              setAttachOpen(!attachOpen);
            }}
            className={`p-2 rounded-lg cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${file ? "text-indigo-300" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
          >
            <Paperclip size={18} />
          </button>

          {attachOpen && (
            <div className="absolute bottom-11 left-0 z-20 bg-[#13151c] border border-white/10 rounded-lg shadow-lg p-1 whitespace-nowrap">
              <button
                disabled={!IMAGE_AGENTS.includes(agent)}
                onClick={() => {
                  setAttachOpen(false);
                  imageRef.current?.click();
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 w-full cursor-pointer rounded-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ImageIcon size={13} className="text-amber-400" /> Upload image
              </button>
              <button
                disabled={!PDF_AGENTS.includes(agent)}
                onClick={() => {
                  setAttachOpen(false);
                  pdfRef.current?.click();
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 w-full cursor-pointer rounded-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <FileText size={13} className="text-orange-400" /> Upload PDF
              </button>
            </div>
          )}
        </div>

        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // stop the newline
              if (text.trim()) handleSendMessage();
            }
          }}
          placeholder="Ask anything..."
          className="flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-slate-600 resize-none field-sizing-content max-h-40 py-2"
        />

        <button
          title="Voice input"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
        >
          <Mic size={18} />
        </button>

        <button
          onClick={handleSendMessage}
          title="Send"
          disabled={!text.trim()}
          className="p-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <SendHorizontal size={16} />
        </button>
      </div>
      <p className="text-center text-[10px] text-slate-600 mt-2">
        Praxis can make mistakes.
      </p>
    </div>
  );
}

export default MessageInput;
