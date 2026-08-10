import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    firebaseUID:{
        type:String,
        unique:true
    },
    name:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        trim:true
    },
    avatar:{
        type:String
    }
},{timestamps:true})

const User = mongoose.model("User",userSchema)

export default User