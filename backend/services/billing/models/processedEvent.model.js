import mongoose, { Schema } from "mongoose";

// One row per Stripe event we've already applied, so retries and replays
// can't credit the same purchase twice. Rows expire well after Stripe stops
// retrying (~3 days).
const processedEventSchema = new Schema({
    eventId:{
        type:String,
        unique:true,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:60*60*24*30
    },
})


const ProcessedEvent = mongoose.model("ProcessedEvent",processedEventSchema)

export default ProcessedEvent
