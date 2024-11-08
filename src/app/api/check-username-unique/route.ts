import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { usernameValidation } from '@/schemas/signUpSchema';
import { NextResponse } from 'next/server';
import {z} from 'zod';


const UsernameQuerySchema = z.object({
    username:usernameValidation,
})

export async function GET(req:Request){
    await dbConnect();
    try {
        //locahlhost:3000/api/cuu?username=div?jowjeo=oeiw;
        //way to exporting the params
        const {searchParams} = new URL(req.url);
        const queryParams = {
            username:searchParams.get('username'),
        }

        //validate with zos
        const result = UsernameQuerySchema.safeParse(queryParams);
        if(!result.success){
            //extracting username
            const usernameErrors = result.error.format().username?._errors || []
            return NextResponse.json({
                success:false,
                messsage:usernameErrors?.length > 0 ? usernameErrors.join(', '):"Invalid query parameteres",
            }, {status:400});
        }

        const {username} = result.data;
        const existingVerifiedUser = await UserModel.findOne({username,isVerified:true});
        if(existingVerifiedUser){
            return NextResponse.json({
                success:false,
                messsage:"username already exists",
            }, {status:400});
        }   
        return NextResponse.json({
            success:true,
            messsage:"Username is availble",
        }, {status:400});


    } catch (error) {
        return NextResponse.json({
            success:false,
            message:"error while chekign username",
        },{status:500});
    }
}