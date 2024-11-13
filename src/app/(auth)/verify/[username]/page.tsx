'use client'
import { useToast } from '@/hooks/use-toast';
import { useParams, useRouter } from 'next/navigation';
import * as z from "zod"

import React, { useEffect, useState } from 'react'
import {  useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { veifySchemaValidation } from '@/schemas/verifySchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';



const VerifyAccount = () => {
  //using this state varibal for otp bcz i don't have resend paid version  
  const [verifyCode, setVerifyCode] = useState('');
  const router = useRouter();
  const param  = useParams<{username:string}>();
  const {toast} = useToast();

  const form = useForm<z.infer<typeof veifySchemaValidation>>  ({
    resolver:zodResolver(veifySchemaValidation),   
  })

  const onSubmit = async (data:z.infer<typeof veifySchemaValidation>) => {
    try {
        const response = await axios.post(`/api/verify-code`,{
            username:param.username,
            code: data.code,
        })
        toast({
            title:"Success",
            description:response.data.message,
        })
        router.replace('/sign-in');
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        console.log(axiosError)
        toast({
            title:"Signup failed",
            description:axiosError.response?.data.message,
            variant:"destructive",
        })
    }
  }

  //useEffect hook basically fetch the code from the db
  useEffect(() => {
    async function fetchCode(){
        try {
            const response = await axios.post('/api/get-verify-code' , {username:param.username});
            console.log(response.data.code);
            toast({
                title:"Verification Code",
                description: response.data.code,
                variant:"destructive",
            })
        } catch (error) {
            console.log("error in fetching the verifycode");
        }
        const response = await axios.post('/api/get-verify-code' , {username:param.username});
    }
    fetchCode();
  } , []);
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            <div  className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Verify Your Account
                </h1>
                <p className='mb-6'>Enter the verification code sent to your email</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Verification Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="code" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    </div>
  )
}

export default VerifyAccount