import Router from 'express'
import { postQues,getAllPost} from '../controllers/post.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'


const router = Router()


router.route('/post-ques').post(authMiddleware, postQues)
router.route('/get-all-post').get(authMiddleware, getAllPost)


export default router