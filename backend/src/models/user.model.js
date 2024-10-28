import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { type } from "os";



const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required."],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required."],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      trim: true,
    },
    profilePic: {
      type: String, // Cloudinary
    },

    bio: {
      type: String,
      trim: true,
    },
    refreshToken:{
      type:String
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function(next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email
    },
    process.env.ACCESS_TOKEN_SECRECT,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY 
    }
)


}


userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email
    },
    process.env.REFRESH_TOKEN_SECRECT,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY 
    }
)


}

export const User = mongoose.model("User", userSchema);
