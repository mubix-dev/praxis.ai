import React from "react";
import Navbar from "./Navbar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import useGetAllMessages from "../../hooks/useGetAllMessages";
import { useSelector } from "react-redux";
import { Code2, Globe, Presentation, FileText } from "lucide-react";

const suggestions = [
  { icon: Code2, color: "text-indigo-400", text: "Debug my React code" },
  { icon: Globe, color: "text-emerald-400", text: "What's new in AI today?" },
  { icon: Presentation, color: "text-pink-400", text: "Draft a pitch deck" },
  { icon: FileText, color: "text-orange-400", text: "Summarize a PDF" },
];

function ChatArea() {
  useGetAllMessages();
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);
  return (
    <div className="flex flex-col justify-between items-center flex-1 h-full min-w-0">
      {selectedConversation && <Navbar />}
      {messages?.length === 0 || !selectedConversation ? (
        <div className="flex-1 w-full flex flex-col items-center justify-center gap-6 px-6 text-center">
          <div>
            <h2 className="text-3xl font-medium tracking-[0.35em] text-slate-100">
              PR<span className="text-indigo-400">A</span>X<span className="text-cyan-400">I</span>S
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              One prompt. Every specialist. What are we building today?
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 max-w-md">
            {suggestions.map((s) => (
              <div
                key={s.text}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-300 bg-white/3 border border-white/8 hover:bg-white/5 hover:border-white/15 cursor-pointer transition-colors"
              >
                <s.icon size={15} className={s.color} />
                {s.text}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <MessageList />
      )}
      <MessageInput />
    </div>
  );
}

export default ChatArea;
