import { Router } from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser, profileImage, userProfile, userBio, verifyOTPCode } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";


const router = Router()
// console.log("Routes", router);

router.route("/register").post(registerUser)
router.route("/verify-code").post(verifyOTPCode)
router.route("/login").post(loginUser)
router.route("/current-user").get(authMiddleware, getCurrentUser)
router.route("/logout").post(authMiddleware, logoutUser)
router.route("/:authorID").get(authMiddleware, userProfile)
router.route("/user-profile-pic").post(authMiddleware, upload.single('profilePic'), profileImage)
router.route("/user-bio").post(authMiddleware, userBio)

export default router