import { createSlice } from "@reduxjs/toolkit";


const useSlice = createSlice({
    name:"user",
    initialState:{
        userData:null,
        userLoading:true
    },
    reducers:{
        setUserData : (state,action)=>{
            state.userData = action.payload
        },
        setUserLoading : (state,action)=>{
            state.userLoading = action.payload
        }
    }
})


export const {setUserData,setUserLoading} = useSlice.actions
export default useSlice.reducer