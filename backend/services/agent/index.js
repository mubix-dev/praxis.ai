import "dotenv/config"
import express from "express"
import connectDb from "./db/db.js"
import router from "./routes/agent.routes.js"

const PORT = process.env.PORT || 3003
const app = express()

app.use(express.json())
app.use("/",router)

app.get("/",(req,res)=>{
    return res.status(200).json({message:"Agent service is running!"})
})

connectDb()
.then(()=>{
    app.listen(PORT,()=>{
    console.log(`Agent service is running at http://localhost:${PORT}`)
})
})
.catch((err)=>{
    console.log("MongoDB connection error: ",err)
    process.exit(1)
})
