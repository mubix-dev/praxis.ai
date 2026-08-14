import React, { useEffect, useState } from "react";
import { Paperclip, Mic, SendHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../features/sendMessage";
import { addMessage, setThinking } from "../../redux/messageSlice";
import {
  addConversation,
  setSelectedConversation,
  updateConversationTitle,
} from "../../redux/conversationSlice.js";
import { createConversation } from "../../features/createConversation.js";
import { generateTitle } from "../../features/generateTitle.js";
function MessageInput({ suggestion }) {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (suggestion) setText(suggestion);
  }, [suggestion]);

  const handleSendMessage = async () => {
    dispatch(setThinking(true));
    try {
      let conversation = selectedConversation;
      if (!conversation) {
        const newConversation = await createConversation();
        dispatch(addConversation(newConversation));
        dispatch(setSelectedConversation(newConversation));
        conversation = newConversation;
      }

      if (conversation?.title === "New Chat") {
        generateTitle(text, conversation._id).then((title) => {
          if (title)
            dispatch(updateConversationTitle({ conversationId: conversation._id, title }));
        });
      }

      dispatch(addMessage({ role: "user", content: text }));
      setText("");
      const data = await sendMessage(text, conversation?._id);
      dispatch(setThinking(false));
      dispatch(addMessage({ role: "assistant", content: data }));
    } catch (error) {
      dispatch(setThinking(false));
      console.log(error);
      setText("");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-4 pb-4 shrink-0">
      <div className="flex items-end gap-1 px-2 py-2 rounded-2xl bg-white/5 border border-white/8 focus-within:border-white/15">
        <button
          title="Attach file"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
        >
          <Paperclip size={18} />
        </button>

        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
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
        Praxis can make mistakes. Verify important info.
      </p>
    </div>
  );
}

export default MessageInput;
