import express from "express"
import dotenv from "dotenv"
import connectDb from "./db/db.js"
dotenv.config()

const PORT = process.env.PORT || 3002

const app = express()

app.use(express.json())


app.get("/",(req,res)=>{
    return res.status(200).json({message:"Chat service is running!"})
})

connectDb()
.then(()=>{
    app.listen(PORT,()=>{
    console.log(`Chat service is running at http://localhost:${PORT}`)
})
})
.catch((err)=>{
    console.log("MongoDB connection error: ",err)
    process.exit(1)
})


