import React from 'react'
import Markdown from "react-markdown"
function MessageBox({ message }) {
  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] md:max-w-[70%] px-4 py-2.5 text-sm whitespace-pre-wrap wrap-break-word ${
          isUser
            ? "rounded-2xl rounded-br-sm bg-indigo-500/25 text-indigo-100"
            : "rounded-2xl rounded-bl-sm bg-white/5 text-slate-300"
        }`}
      >
        <Markdown>
        {message.content}
        </Markdown>
      </div>
    </div>
  )
}

export default MessageBox
