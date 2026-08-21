import express from "express"
import dotenv from "dotenv"
import connectDb from "./db/db.js"
import router from "./routes/credits.routes.js"
import { stripeWebhook } from "./controllers/billing.controller.js"
dotenv.config()

const PORT = process.env.PORT || 3004

const app = express()

app.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook)

app.use(express.json())

app.use("/",router)


app.get("/",(req,res)=>{
    return res.status(200).json({message:"Billing service is running!"})
})

connectDb()
.then(()=>{
    app.listen(PORT,()=>{
    console.log(`Billing service is running at http://localhost:${PORT}`)
})
})
.catch((err)=>{
    console.log("MongoDB connection error: ",err)
    process.exit(1)
})


