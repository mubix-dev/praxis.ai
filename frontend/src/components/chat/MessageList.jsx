import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import MessageBox from './MessageBox'

const autoStages = [
  "Choosing the right agent...",
  "Working on your request...",
  "Still working — this can take a moment...",
]
const autoStageDelays = [2000, 8000] // stage 0 → 1 after 2s, 1 → 2 after 8 more

const thinkingTexts = {
  chat: "Thinking...",
  search: "Searching the web...",
  coding: "Writing code...",
  pdf: "Working on your document...",
  ppt: "Building your slides...",
  vision: "Processing...",
}

function MessageList() {
  const { messages, thinking, loadingMessages } = useSelector((state) => state.message)
  const { selectedConversation } = useSelector((state) => state.conversation)
  const bottomRef = useRef(null)
  const lastConvRef = useRef(null)
  const [autoStage, setAutoStage] = useState(0)

  // step the auto-mode text through its stages while thinking
  useEffect(() => {
    setAutoStage(0)
    if (thinking !== "auto") return
    const timers = autoStageDelays.map((_, i) =>
      setTimeout(
        () => setAutoStage(i + 1),
        autoStageDelays.slice(0, i + 1).reduce((a, b) => a + b, 0),
      ),
    )
    return () => timers.forEach(clearTimeout)
  }, [thinking])

  useEffect(() => {
    const isNewConversation = lastConvRef.current !== selectedConversation?._id
    lastConvRef.current = selectedConversation?._id
    bottomRef.current?.scrollIntoView(isNewConversation ? undefined : { behavior: "smooth" })
  }, [messages, thinking])

  if (loadingMessages) {
    return (
      <div className="flex-1 w-full overflow-y-auto no-scrollbar">
        <div className="max-w-3xl mx-auto px-4 py-5 flex flex-col gap-4 animate-pulse">
          <div className="self-end w-1/2 h-10 rounded-2xl rounded-br-sm bg-indigo-500/10" />
          <div className="self-start w-3/4 h-20 rounded-2xl rounded-bl-sm bg-white/5" />
          <div className="self-end w-1/3 h-10 rounded-2xl rounded-br-sm bg-indigo-500/10" />
          <div className="self-start w-2/3 h-14 rounded-2xl rounded-bl-sm bg-white/5" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 w-full overflow-y-auto no-scrollbar">
      <div className="max-w-3xl mx-auto px-4 py-5 flex flex-col gap-3">
        {messages.map((message, i) => (
          <MessageBox key={message._id || i} message={message} />
        ))}

        {thinking && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl rounded-bl-sm  text-sm text-slate-500">
              <span className="flex items-center gap-0.75">
                {[
                  { color: "#6d5efc", height: 6 },
                  { color: "#22d3ee", height: 12 },
                  { color: "#ec4899", height: 8 },
                  { color: "#10b981", height: 11 },
                ].map((bar, i) => (
                  <span
                    key={i}
                    className="w-0.75 rounded-full animate-[eq_1s_ease-in-out_infinite]"
                    style={{ background: bar.color, height: `${bar.height}px`, animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </span>
              {thinking === "auto"
                ? autoStages[autoStage]
                : thinkingTexts[thinking] || "Thinking..."}
            </div>
          </div>
        )}

        {/* scroll anchor */}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

export default MessageList
