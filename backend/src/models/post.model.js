import mongoose,{Schema} from "mongoose";


const postSchema = new mongoose.Schema(
  {
    authorID: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'Author is required']
    },
    author:{
      type: String,
      required: [true, 'Post is required']
    },
    content: {
        type: String,
        required: [true, 'Post is required']
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],


  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model("Post", postSchema);
