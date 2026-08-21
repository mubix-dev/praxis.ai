import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setSelectedConversation } from "../redux/conversationSlice"

// the single URL -> Redux bridge: /chat/:conversationId drives the selection
function useSyncConversationFromUrl() {
  const { conversationId } = useParams()
  const { conversations, selectedConversation } = useSelector((state) => state.conversation)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!conversationId) {
      if (selectedConversation) dispatch(setSelectedConversation(null))
      return
    }
    if (selectedConversation?._id === conversationId) return
    const conv = conversations.find((c) => c._id === conversationId)
    if (conv) dispatch(setSelectedConversation(conv))
  }, [conversationId, conversations])
}

export default useSyncConversationFromUrl
