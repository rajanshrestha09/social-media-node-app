import Router from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { userCommentToPost,getCommentBaseOnPost } from '../controllers/comment.controller.js'


const router = Router()


router.route('/comment-to-post').post(authMiddleware, userCommentToPost)
router.route('/get-comment').get(authMiddleware, getCommentBaseOnPost)



export default router