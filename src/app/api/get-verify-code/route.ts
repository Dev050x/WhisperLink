import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";


export async function POST(req:Request){
    await dbConnect();
    console.log("hello from the api get verify code");
    try {
        const {username} = await req.json();
        const user = await UserModel.findOne({username});
        if(!user){
            return NextResponse.json({
                message:"username not found"
            } , {status:400});
        }
        const otp = user.verifyCode;
        if(!otp){
            return NextResponse.json({
                message:"otp not found"
            } , {status:400});
        }
        return NextResponse.json({
            message:"otp found succefully",
            code:otp,
        } , {status:200});

    } catch (error) {
        return NextResponse.json({
            message:"there is some error in finding the otp"
        } , {status:400});
    }
}