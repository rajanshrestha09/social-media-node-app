import mongoose, { Schema, Document } from "mongoose";


const commentSchema = new mongoose.Schema(
  {
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: [true, 'Author is required']
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required: [true, 'Post is required']
    },
    authorName:{
      type: String,
      required: [true, 'User is required']
    },
    content: [{
        type: String,
        required: [true, 'Post is required']
    }],


  },
  {
    timestamps: true,
  }
);



export const Comment = mongoose.model("Comment", commentSchema);
