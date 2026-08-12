import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import proxy from "express-http-proxy"
import cookieParser from "cookie-parser"
import isAuth from "./middlewares/auth.middleware.js"
import getCurrentUser from "./controllers/user.controller.js"
import { proxyWithHeaders } from "./utils/proxyWithHeaders.js"
dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials :true
}))

app.use("/api/auth",proxy(process.env.AUTH_SERVICE))
app.get("/api/me",isAuth,getCurrentUser)
app.use("/api/chat",isAuth,proxyWithHeaders(process.env.CHAT_SERVICE))
app.use("/api/agent",isAuth,proxyWithHeaders(process.env.AGENT_SERVICE))


app.get("/",(req,res)=>{
    return res.status(200).json({message:"Gateway is running!"})
})





app.listen(PORT,()=>{
    console.log(`Gateway is running at http://localhost:${PORT}`)
})