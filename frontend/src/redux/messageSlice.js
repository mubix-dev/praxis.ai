import { createSlice } from "@reduxjs/toolkit";


const messageSlice = createSlice({
    name:"message",
    initialState:{
        messages:[],
        thinking:false,
        openArtifact:null
    },
    reducers:{
        setMessages : (state,action)=>{
            state.messages = action.payload
        },
        addMessage :(state,action)=>{
            state.messages.push(action.payload)
        },
        setThinking: (state,action)=>{
            state.thinking = action.payload
        },
        setOpenArtifact: (state,action)=>{
            state.openArtifact = action.payload
        }
    }
})


export const {setMessages,addMessage,setThinking,setOpenArtifact} = messageSlice.actions
export default messageSlice.reducer