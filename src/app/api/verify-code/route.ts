import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { NextResponse } from 'next/server';
import {z} from 'zod';

export async function POST(req:Request){
    await dbConnect();
    try {
        const {username , code} = await req.json();
        const decodedUsernama = decodeURIComponent(username);
        const user = await UserModel.findOne({username:decodedUsernama});
        //if there is no user
        if(!user){
            return NextResponse.json({
                success:false,
                message:"user not  found",
            },{status:500});
        }

        //verifying code
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpire = new Date(user.verifyCodeExpiry) > new Date();

        //everything is fine
        if(isCodeValid && isCodeNotExpire){

            user.isVerified = true,
            user.save();
            return NextResponse.json({
                success:true,
                message:"Account verified Succefully",
            },{status:200});

        } else if(!isCodeNotExpire){
            return NextResponse.json({
                success:false,
                message:"code expired please sign up again & get a new code",
            },{status:500});
        } else{
            return NextResponse.json({
                success:false,
                message:"code is invalid",
            },{status:500});
        }


    } catch (error) {
        return NextResponse.json({
            success:false,
            message:"error while verifying mail",
        },{status:500});   
    }
}