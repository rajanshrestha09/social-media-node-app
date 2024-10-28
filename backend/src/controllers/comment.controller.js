import { User } from "../models/user.model.js"
import APIResponse from "../utils/APIResponse.js";

import { commentZodSchema } from "../zodSchema/commentZodSchema.js";
import { Comment } from "../models/comment.model.js";
import { z } from 'zod'

const commentSchema = z.object({
    commentSche: commentZodSchema
})

const userCommentToPost = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password -refreshToken -email -profilePic -bio")
        // console.log("Comment user::", user);
        if (!user) {
            return res.status(401).json(APIResponse.errorMethod(false, "Username/Email doesnot exist.", 401))
        }
        const { id, content } = req.body // From front-end
        // console.log(content);
        // console.log(typeof user._id);

        const result = commentSchema.safeParse({
            commentSche: {
                postId: id,
                authorId: user?._id,
                authorName: user?.username,
                content: content
            }
        })
        if (!result.success) {
            console.log(result.error.errors);

            const errorMessages = result.error.errors.map((err) => ({
                path: err.path.join('.'),
                message: err.message
            }));
            return res.status(401).json(
                APIResponse.errorMethod(false, errorMessages, 401)
            )
        }

        const comment = await Comment.create({
            postId: id,
            authorId: user?._id,
            authorName: user?.username,
            content: content

        })
        // console.log("Comment:::", comment);

        if (!comment) {
            return res.status(401).json(
                APIResponse.errorMethod(false, "Error while commenting out.", 401)
            )
        }
        return res.status(200).json(
            APIResponse.successMethod(true, "Comment success.", 200)
        )
    } catch (error) {
        return res.status(500).json(APIResponse.errorMethod(false, error, 500))
    }

}

const getCommentBaseOnPost = async (req, res) => {
    try {
        // console.log(req.query);

        const { postId } = req.query // value pass using btn clicked
        // console.log(`Post id :: ${postId}`);

        if (!postId) {
            return res.status(401).json(APIResponse.errorMethod(false, "PostId is not valid", 401))

        }
        const comment = await Comment.find({ postId: postId })

        // console.log('Here', comment);

        
        if (!comment) {
            return res.status(401).json(APIResponse.errorMethod(false, "Username/Email doesnot exist.", 401))
        }
        return res.status(200).json(
            APIResponse.successMethod(true, "Comment retrive successfully.", 200, comment)
        )

    } catch (error) {
        return res.status(500).json(APIResponse.errorMethod(false, error, 500))
    }
}
// const getCommentBaseOnPost = async (req, res) => {
//     try {       
//         const { postId } = req.query

//         if (!postId) {
//             return res.status(401).json(APIResponse.errorMethod(false, "PostId is not valid", 401))

//         }

//         const comment = await Comment.aggregate([
//             {
//                 $group: {
//                     _id: "$postId",
//                     totalComments: {
//                         $count: {} //$sum:1
//                     },
//                     "commentFromBack": {
//                         $push: {
//                             commentId: "$_id",
//                             content: "$content",
//                             authorName: "$authorName"
//                         }
//                     }

//                 },
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     postId: "$_id",
//                     totalComments: 1,
//                     commentFromBack: 1
//                 }
//             }
//         ])
//         if (!comment) {
//             return res.status(401).json(APIResponse.errorMethod(false, "Username/Email doesnot exist.", 401))
//         }
//         return res.status(200).json(
//             APIResponse.successMethod(true, "Comment retrive successfully.", 200, comment)
//         )

//     } catch (error) {
//         return res.status(500).json(APIResponse.errorMethod(false, error, 500))
//     }
// }
export {
    userCommentToPost,
    getCommentBaseOnPost

}