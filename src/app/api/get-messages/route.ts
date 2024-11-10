import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import UserModel from "@/model/User";
import mongoose from "mongoose";


export async function GET(req:Request){
    await dbConnect();
    
    //extracting session data of logged in user
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !session.user){
        return NextResponse.json({
            success:false,
            message:"not authenticated",
        } , {status:401})
    }


    const userId = new mongoose.Types.ObjectId(user._id);
    // const userId = new mongoose.Types.ObjectId('672e4559b2fc5706d8e229dd');
    try {
        
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$message' },
            { $sort: { 'message.createdAt': -1 } },
            { $group: { _id: '$_id', message: { $push: '$message' } } }
          ]);
        console.log(user);
        if(!user || !user.length){
            return NextResponse.json({
                success:false,
                message:"user not found",
            } , {status:401})
        }


        return NextResponse.json({
            success:true,
            messages:user[0].message,
        } , {status:200})


    } catch (error) {
        return NextResponse.json({
            success:false,
            message:"error while getting message",
        } , {status:401})
    }
}