import mongoose from "mongoose";



const likeSchema  = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: "Post"
        }
    },
    {
        timestamps:true
    }
)

export const Like =  mongoose.model("Like", likeSchema)

