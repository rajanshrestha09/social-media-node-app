import { User } from "../models/user.model.js"
import APIResponse from "../utils/APIResponse.js";
import { signUpSchema } from "../zodSchema/signUpSchema.js";
import { signInSchema } from "../zodSchema/signInSchema.js";
import { z } from 'zod'
import uploadOnCloudinary from "../utils/cloudinary.js"
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";

const registerSchema = z.object({
    body: signUpSchema
})

const loginSchema = z.object({
    body: signInSchema
})




const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new APIResponse.errorMethod(false, error, 401)
    }
}

// ====================== Register User ================================
const registerUser = async (req, res) => {
    try {
        const result = registerSchema.safeParse({ body: req.body })
        if (!result.success) {
            const errorMessages = result.error.errors.map((err) => ({
                path: err.path.join('.'),
                message: err.message
            }));
            return res.status(401).json(
                APIResponse.errorMethod(false, errorMessages, 401)
            )
        }

        // OTP Code
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        const { username, email, password } = req.body
        const existingVerifiedUserByUsername = await User.findOne({
            $and: [{ username }, { isUserVerified: true }]
        })

        if (existingVerifiedUserByUsername) {
            return res.status(401).json(APIResponse.errorMethod(false, "Username already exist.", 401))
        }


        const existingUserByEmail = await User.findOne({ email }).select("-password -verifyCode")


        if (existingUserByEmail) {
            if (existingUserByEmail.isUserVerified) {
                return res.status(401).json(APIResponse.errorMethod(false, "User already exist with this email.", 401))
            } else {
                const user = await User.findByIdAndUpdate(existingUserByEmail._id,
                    { email, username, verifyCode, password },
                    {
                        new: true,
                        select: "-password -verifyCode -isUserVerified"
                    })
                if (!user) {
                    return res.status(401).json(APIResponse.errorMethod(false, "Usernot updated.", 401))
                }
                const sendVerificationMailSuccessfully = await sendVerificationEmail(email, username, verifyCode)
                if (!sendVerificationMailSuccessfully) {
                    return res.status(401).json(APIResponse.errorMethod(false, "user.controller::==>Email Send failed", 401))
                }
                return res.status(200).json(APIResponse.successMethod(true, "Register successfully.", 200, user))
            }
        } else {
            const user = await User.create({
                username,
                email,
                password,
                verifyCode
            })

            const createdUser = await User.findById(user._id).select("-password -verifyCode -isUserVerified")
            if (!createdUser) {
                return res.status(401).json(APIResponse.errorMethod(false, "Something went wrong while register user.", 401))
            }

            const sendVerificationMailSuccessfully = await sendVerificationEmail(email, username, verifyCode)
            if (!sendVerificationMailSuccessfully) {
                return res.status(401).json(APIResponse.errorMethod(false, "user.controller::==>Email Send failed", 401))
            }

            return res.status(200).json(APIResponse.successMethod(true, "Register successfully.", 200, createdUser))
        }


    } catch (error) {
        return res.status(500).json(APIResponse.errorMethod(false, `something wrong in server:: , ${error}`, 500))
    }


}

const verifyOTPCode = async (req, res) => {
    try {
        const { username, verifyCode } = req.body
        const existedUser = await User.findOne({ username })

        if (!existedUser) {
            return res.status(401).json(
                APIResponse.errorMethod(false, "User not exist", 401)
            )
        }

        if (existedUser.verifyCode === verifyCode) {
            existedUser.isUserVerified = true
            await existedUser.save()
            return res
                .status(200)
                .json(
                    APIResponse.successMethod(true, "Verify code successfully", 200)
                )
        }else{
            return res
            .status(401)
            .json(
                APIResponse.errorMethod(false, "OTP not match. Please check OTP code", 401)
            )
        }
    }
    catch (error) {
        return res.status(500).json(APIResponse.errorMethod(false, error.message, 500))
    }

}

// ====================== Login User ================================
const loginUser = async (req, res) => {
    try {
        const result = loginSchema.safeParse({ body: req.body })
        if (!result.success) {
            const errorMessages = result.error.errors.map((err) => ({
                path: err.path.join('.'),
                message: err.message
            }))
            return res.status(401).json(
                APIResponse.errorMethod(false, errorMessages, 401)
            )
        }

        const { username, password } = req.body

        const existedUser = await User.findOne({
            $and: [{
                $or: [
                    {
                        username: username
                    },
                    {
                        email: username
                    }
                ]
            },
            {
                isUserVerified: true
            }
            ]
        })



        if (!existedUser) {
            return res.status(401).json(
                APIResponse.errorMethod(false, "User not exist", 401)
            )
        }

        const isPasswordValid = await existedUser.isPasswordCorrect(password)


        if (!isPasswordValid) {
            return res.status(401).json(APIResponse.errorMethod(false, "Incorrect Password.", 401))
        }



        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existedUser._id);


        const loginUser = await User.findById(existedUser._id).select("-password -refreshToken")

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                APIResponse.successMethod(true, "Login success", 200, loginUser)
            )




    } catch (error) {
        return res.status(500).json(APIResponse.errorMethod(false, error.message, 500))
    }
}
// ====================== Current User ================================
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password -refreshToken');
        if (!user) {
            return res.status(401).json(
                APIResponse.errorMethod(false, "User not found", 401)
            )
        }
        return res
            .status(200)
            .json(APIResponse.successMethod(true, "Successfully get current user", 200, user))
    } catch (error) {
        return res.status(500).json(APIResponse.errorMethod(false, error.message, 500))
    }
}

// ====================== Logout User ================================
const logoutUser = async (req, res) => {
    try {
        User.findByIdAndUpdate(req.userId, {
            $unset: {
                refreshToken: 1
            }
        },
            {
                new: true
            })

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(APIResponse.successMethod(true, "Logout success", 200))

    } catch (error) {
        return res.status(500).json(APIResponse.errorMethod(false, error.message, 500))
    }
}

// ====================== Upload User Profile ================================
const profileImage = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password")
        const localProfileImagePath = req.file.path

        if (!user) {
            return res.status(400).json(APIResponse.errorMethod(false, 'User not found', 400))
        }

        if (!localProfileImagePath) {
            return res.status(400).json(APIResponse.errorMethod(false, 'local path not found', 400))
        }

        const profileImage = await uploadOnCloudinary(localProfileImagePath)

        if (!profileImage) {
            return res.status(400).json(APIResponse.errorMethod(false, 'Error while uploading on clodinary', 400))
        }

        user.profilePic = profileImage.url
        if (!user.profilePic) {
            return res.status(400).json(APIResponse.errorMethod(false, 'Error while uploading on clodinary', 400))
        }
        user.save()
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        return res.status(200).json(APIResponse.successMethod(true, 'Profile image uploaded successfully', 200, user))

    } catch (error) {
        return res.status(500).json(APIResponse.errorMethod(false, error.message, 500))
    }



}

const userProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.authorID).select("-password -refreshToken -updatedAt");
        if (!user) return res.status(400).json(APIResponse.errorMethod(false, 'User not found', 400))
        return res
            .status(200)
            .json(APIResponse.successMethod(true, "Successfully get current user", 200, user))

    } catch (error) {
        return res.status(500).json(APIResponse.errorMethod(false, error.message, 500))
    }
}

const userBio = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password")
        if (!user) {
            return res.status(400).json(APIResponse.errorMethod(false, 'User not found', 400))
        }
        const { bio } = req.body
        user.bio = bio
        if (!user.bio) {
            return res.status(400).json(APIResponse.errorMethod(false, 'Error while uploading bio', 400))
        }
        user.save()
        return res.status(200).json(APIResponse.successMethod(true, "Bio updated successfully', 200", user))

    } catch (error) {
        return res.status(500).json(APIResponse.errorMethod(false, error.message, 500))
    }
}

export { registerUser, loginUser, logoutUser, getCurrentUser, profileImage, userProfile, userBio, verifyOTPCode }