import React from 'react'
import { useSelector } from 'react-redux'
import MessageBox from './MessageBox'

function MessageList() {
  const { messages } = useSelector((state) => state.message)

  return (
    <div className="flex-1 w-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-5 flex flex-col gap-3">
        {messages.map((message) => (
          <MessageBox key={message._id} message={message} />
        ))}
      </div>
    </div>
  )
}

export default MessageList
