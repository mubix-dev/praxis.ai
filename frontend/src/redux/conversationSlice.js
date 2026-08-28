import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    conversations: [],
    selectedConversation: null,
  },
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    addConversation: (state, action) => {
      state.conversations.unshift(action.payload);
    },
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    updateConversationTitle: (state, action) => {
      const { conversationId, title } = action.payload;
      const conv = state.conversations.find((c) => c._id === conversationId);
      if (conv) conv.title = title;
      if (state.selectedConversation?._id === conversationId)
        state.selectedConversation.title = title;
    },
    removeConversation: (state, action) => {
      state.conversations = state.conversations.filter(
        (c) => c._id !== action.payload,
      );
      if (state.selectedConversation?._id === action.payload)
        state.selectedConversation = null;
    },
  },
});

export const { setConversations, addConversation, setSelectedConversation,updateConversationTitle, removeConversation } =
  conversationSlice.actions;
export default conversationSlice.reducer;
