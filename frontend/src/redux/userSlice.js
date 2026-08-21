import { createSlice } from "@reduxjs/toolkit";


const useSlice = createSlice({
    name:"user",
    initialState:{
        userData:null,
        userLoading:true,
        credits:0
    },
    reducers:{
        setUserData : (state,action)=>{
            state.userData = action.payload
        },
        setUserLoading : (state,action)=>{
            state.userLoading = action.payload
        },
        setCredits : (state,action)=>{
            state.credits = action.payload
        }
    }
})


export const {setUserData,setUserLoading,setCredits} = useSlice.actions
export default useSlice.reducer