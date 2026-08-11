import { createSlice } from "@reduxjs/toolkit";


const useSlice = createSlice({
    name:"user",
    initialState:{
        userData:null
    },
    reducers:{
        setUserData : (state,action)=>{
            state.userData = action.payload
        }
    }
})


export const {setUserData} = useSlice.actions
export default useSlice.reducer