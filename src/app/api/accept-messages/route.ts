import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextAuth]/options";
import { NextResponse } from "next/server";
import UserModel from "@/model/User";


//logged in user able to toggle accept-message
export async function POST(req:Request){
    await dbConnect();
    
    //extracting session data of logged in user
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || session.user){
        return NextResponse.json({
            success:false,
            message:"not authenticated",
        } , {status:401})
    }


    const userId = user._id;
    const {acceptMessages} = await req.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage:acceptMessages},
            {new:true}
        )
        if(!updatedUser){
            return NextResponse.json({
                success:false,
                message:"failed to toggle accept message",
            } , {status:401})
        }

        return NextResponse.json({
            success:true,
            message:"user status updated",
        } , {status:200})

    } catch (error) {
        console.log("failed to update user status");
        return NextResponse.json({
            success:false,
            message:"failed to toggle accept message",
        } , {status:401})
    }



}


//status of accepting message
export async function GET(req:Request) {
    await dbConnect();
    
    //extracting session data of logged in user
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || session.user){
        return NextResponse.json({
            success:false,
            message:"not authenticated",
        } , {status:401})
    }


    const userId = user._id;
    
    try {
        const foundUser = await UserModel.findById(userId);
        if(!foundUser){
            return NextResponse.json({
                success:false,
                message:"user not found",
            } , {status:401})
        }
        return NextResponse.json({
            success:true,
            message:"user found",
            isAcceptingMessages:foundUser.isAcceptingMessage,
    
        } , {status:200})

    } catch (error) {
        return NextResponse.json({
            success:false,
            message:"error while getting acceptance status",
        } , {status:401})
        
    }
}