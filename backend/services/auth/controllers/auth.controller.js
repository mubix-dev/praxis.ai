import {getAuth} from "firebase-admin/auth"
import {app} from "../config/firebase.js"
import User from "../models/user.model.js"

import redis from  "../../../shared/redis/redis.js"

const cookieOptions = {
    httpOnly:false,
    secure:process.env.NODE_ENV === "production",
    sameSite:process.env.NODE_ENV === "production" ? "none":"strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
}

export const login = async(req,res)=>{
    try {
        const {token} = req.body
        const decoded = await getAuth(app).verifyIdToken(token)

        let user = await User.findOne({
            firebaseUID:decoded.uid
        })

        if(!user){
            user = await User.create({
                firebaseUID:decoded.uid,
                name:decoded.name,
                email:decoded.email,
                avatar:decoded.picture
            }) 
        }

        const sessionId = crypto.randomUUID()

        await redis.set(`sessionId-${sessionId}`,JSON.stringify({
            userId:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar
        }),"EX",7 * 24 * 60 * 60)

        res.cookie("sessionId",sessionId,{
            ...cookieOptions
        })

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:`Login error: ${error}`})
    }
}


export const logout = async(req,res)=>{
    try {
        const sessionId = req.cookies.sessionId
        redis.del(`sessionId-${sessionId}`)

        res.clearCookie("sessionId")
        return res.status(200).json({message:"Logout Successfully!"})
    } catch (error) {
        return res.status(500).json({message:`Logout error: ${error}`})
    }
}