'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { signUpSchemaValidation } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchemaValidation } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
//for this page we are using shadcn fomr component


const SignupForm = () => {;
  const { toast } = useToast();
  const router = useRouter();

  //zod implementation        infering is optinal
  const form = useForm<z.infer<typeof signInSchemaValidation>>  ({
    resolver:zodResolver(signInSchemaValidation),   //need schema
    defaultValues: {
      identifier:'',
      password:'',
    }
  })


  const onSubmit = async (data: z.infer<typeof signInSchemaValidation>) => {
    console.log("submitting signin")
    const result = await signIn('credentials',{
      redirect:false,
      identifier: data.identifier,
      password: data.password
    })
    if(result?.error){
      toast({
        title:"Login failed",
        description:"Incorrect username or password",
        variant:"destructive",
      })
    }
    if(result?.url){
      console.log("replacing signin page with dashboard");
      router.replace(`/dashboard`);
    }
  }
 


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div  className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p>Sign In to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}  
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}  
            />
            <Button type="submit">
              Sign In
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default SignupForm;