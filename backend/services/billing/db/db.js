import mongoose from "mongoose"
import dns from 'dns'

dns.setServers([
    '8.8.8.8',
    '1.1.1.1'
])


const connectDb = async()=>{
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected successfully!")
    } catch (error) {
        console.log("MongoDB error: ",error)
        process.exit(1)
    }
}

export default connectDb