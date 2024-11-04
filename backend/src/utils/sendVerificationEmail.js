import { Resend } from 'resend'
import APIResponse from './APIResponse.js'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email, username, verifyCode) {
    try {
       const data = await resend.emails.send({
            from: "email@rajanshr.com",
            to: email,
            subject: "OTP Code for Registration",
            html: `<p>Hello <strong> ${username}</strong>,<br> Your verification code is : ${verifyCode}</p>`
        })

        
        return data
    } catch (error) {
        return res.status(400).json(APIResponse.errorMethod(false, `Something went wrong while sending verificationEmail, ${error}`, 400))
    }
}