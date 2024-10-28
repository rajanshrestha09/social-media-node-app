import mongoose from "mongoose";



const followSchema = new mongoose.Schema(
    {
        followerId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        followingId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps:true
    }
)

export const Follow =  mongoose.model("Follow", followSchema)

