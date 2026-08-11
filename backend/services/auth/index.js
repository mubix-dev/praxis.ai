import express from "express"
import dotenv from "dotenv"
import connectDb from "./db/db.js"
import router from "./routes/auth.routes.js"
dotenv.config()

const PORT = process.env.PORT || 3001

const app = express()

app.use(express.json())


app.use("/",router)

app.get("/",(req,res)=>{
    return res.status(200).json({message:"Auth is running!"})
})

connectDb()
.then(()=>{
    app.listen(PORT,()=>{
    console.log(`Auth is running at http://localhost:${PORT}`)
})
})
.catch((err)=>{
    console.log("MongoDB connection error: ",err)
    process.exit(1)
})


