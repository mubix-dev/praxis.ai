import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import MessageBox from './MessageBox'

const thinkingTexts = {
  auto: "Thinking...",
  chat: "Thinking...",
  search: "Searching the web...",
  coding: "Writing code...",
  pdf: "Working on your document...",
  ppt: "Building your slides...",
  vision: "Analyzing...",
}

function MessageList() {
  const { messages, thinking, loadingMessages } = useSelector((state) => state.message)
  const { selectedConversation } = useSelector((state) => state.conversation)
  const bottomRef = useRef(null)
  const lastConvRef = useRef(null)

  useEffect(() => {
    // instant jump when opening a conversation, smooth only for new messages
    const isNewConversation = lastConvRef.current !== selectedConversation?._id
    lastConvRef.current = selectedConversation?._id
    bottomRef.current?.scrollIntoView(isNewConversation ? undefined : { behavior: "smooth" })
  }, [messages, thinking])

  // skeleton while a conversation's messages load
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
            <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm bg-white/5 text-sm text-slate-500 animate-pulse">
              {thinkingTexts[thinking] || "Thinking..."}
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
