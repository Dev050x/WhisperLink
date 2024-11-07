import {resend} from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificatioEmail";

export async function sendverificationEmail(
    email:string,
    username:string,
    verifyCode:string,
):Promise<ApiResponse>{
    try{    
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "Mystry message | Verification Code",
            react: VerificationEmail({username , otp:verifyCode}),
          });
        return {success:true, message:"Verification Mail Send Succefully"};
    }   
    catch(emailError){
        console.error("error while sending verification mail",emailError);
        return {success:false , message:"failed to send verification mail"}
    }
}