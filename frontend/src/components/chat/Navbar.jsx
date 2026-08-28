import { MessageSquare } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'

function Navbar() {
  const {selectedConversation} = useSelector(state=>state.conversation)
  const {messages} = useSelector(state=>state.message)
  return (
    <div className='h-14 w-full pl-14 pr-5 md:px-5 gap-2.5 border-b border-white/8 flex items-center bg-[#0d0f14] shrink-0'>
      <MessageSquare size={16} className="shrink-0 text-slate-500" />
      <p className="flex-1 min-w-0 text-sm font-medium truncate">
        {selectedConversation?.title || "New Chat"}
      </p>
      <span className="shrink-0 px-2 py-0.5 rounded-full text-[11px] text-slate-400 bg-white/5 border border-white/8">
        {messages?.length || 0} messages
      </span>
    </div>
  )
}

export default Navbar