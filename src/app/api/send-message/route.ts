import UserModel, { Message } from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try {
        const {username , content} = await req.json();
        const user = await UserModel.findOne({username});
        if(!user || !user.isAcceptingMessage){
            return NextResponse.json({
                success:false,
                message:"user not found or user not accepting messages"
            },{status:404})
        }
        const newMessage = {content , createdAt:new Date()} as Message;
        user.message.push(newMessage);
        user.save();
        return NextResponse.json({
            success:true,
            message:"message sent succesfully",
        } , {status:200})

    } catch (error) {
        console.log("oops not able to send message",error);
        return NextResponse.json({
            success:false,
            message:"not able to send message",
        } , {status:401})
    }
}