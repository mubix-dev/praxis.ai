import React from 'react'

function ChatArea() {
  return (
    <div className="flex flex-col flex-1 h-full min-w-0">

      {/* messages */}
      <div className="flex-1 overflow-y-auto p-4">
        
      </div>

      <div className="shrink-0 p-4 border-t border-white/8">
        input
      </div>

    </div>
  )
}

export default ChatArea
