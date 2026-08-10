import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import proxy from "express-http-proxy"
dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())

app.use("/auth",proxy(process.env.AUTH_SERVICE))

app.get("/",(req,res)=>{
    return res.status(200).json({message:"Gateway is running!"})
})
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials :true
}))




app.listen(PORT,()=>{
    console.log(`Gateway is running at http://localhost:${PORT}`)
})