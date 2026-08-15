import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import MessageBox from './MessageBox'

function MessageList() {
  const { messages, thinking } = useSelector((state) => state.message)
  const bottomRef = useRef(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, thinking])

  return (
    <div className="flex-1 w-full overflow-y-auto no-scrollbar">
      <div className="max-w-3xl mx-auto px-4 py-5 flex flex-col gap-3">
        {messages.map((message) => (
          <MessageBox key={message._id} message={message} />
        ))}

        {thinking && (
          <div className="flex justify-start">
            <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm bg-white/5 text-sm text-slate-500 animate-pulse">
              Thinking...
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
