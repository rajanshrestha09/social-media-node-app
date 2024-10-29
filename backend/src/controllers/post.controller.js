import { User } from "../models/user.model.js"
import APIResponse from "../utils/APIResponse.js";
import { z } from 'zod'
import { postSchema } from "../zodSchema/postSchema.js";
import { Post } from "../models/post.model.js";

const postSchemaIn = z.object({
    postContent: postSchema
})

const postQues = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password -refreshToken -email -profilePic -bio")
        if (!user) {
            return res.status(401).json(APIResponse.errorMethod(false, "Username/Email doesnot exist.", 401))
        }
    
        
        const { content } = req.body
        if(!content){
            return res.status(401).json(
                APIResponse.errorMethod(false, "No post from front end.", 401)
            )
        }
        const result = postSchemaIn.safeParse({ 
            postContent: { 
                authorID: user?._id, 
                author: user?.username, 
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

        const post = await Post.create({
            authorID: user?._id, 
            author: user?.username,
            content
        })
    
        
        if (!post) {
            return res.status(401).json(
                APIResponse.errorMethod(false, "Error while posting question.", 401)
            )
        }

        return res.status(200).json(
            APIResponse.successMethod(true, "Post successfully", 200, post)
        )

    } catch (error) {
        return res.status(500).json(APIResponse.errorMethod(false, error, 500))
    }
}

const getAllPost = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(401).json(APIResponse.errorMethod(false, "Username/Email doesnot exist.", 401))
        }

        const posts = await Post.find()
   
        if (!posts) {
            return res.status(401).json(APIResponse.errorMethod(false, "Post not able to fetch", 401))
        }

        return res.status(200).json(APIResponse.successMethod(false, "Post not able to fetch", 200,  posts ))



    } catch (error) {
        return res.status(500).json(APIResponse.errorMethod(false, error, 500))
    }
}

export { postQues, getAllPost }