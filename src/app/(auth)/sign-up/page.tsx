'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchemaValidation } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
//for this page we are using shadcn fomr component


const SignupForm = () => {
  const [username,setUsername] = useState('');
  //for username is availble or not
  const [usernameMessage, setUsernameMessage] = useState('');
  //for loader for cheking username(while cheking the unqiqueness of username)
  //both field are  for loader
  const [isChekingUsername, setIsChekingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);//form
  //debouncing library usehooks-ts
  const debounced = useDebounceCallback(setUsername , 300);
  const { toast } = useToast();
  const router = useRouter();

  //zod implementation        infering is optinal
  const form = useForm<z.infer<typeof signUpSchemaValidation>>  ({
    resolver:zodResolver(signUpSchemaValidation),   //need schema
    defaultValues: {
      username:'',
      password:'',
      email:''
    }
  })


  //for the cheking uesrname is unique
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if(username){
        setIsChekingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          let message = response.data.message;
          console.log(message);
          setUsernameMessage(message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          console.log(axiosError)
          setUsernameMessage(
            axiosError.
            response?.data.message ?? 'Error checking username'
          );
        }finally{
          setIsChekingUsername(false);
        }
      }
    }
    checkUsernameUnique();

  } ,[username]);

  const onSubmit = async (data: z.infer<typeof signUpSchemaValidation>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up',data);
      toast({
        title:'Success',
        description:response.data.message,
      })
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("erro in signup of user" , error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title:"sign up failed",
        description:errorMessage,
        variant:"destructive",
      })
      setIsSubmitting(false);
    }
  }
 


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div  className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p>Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} 
                    onChange={(e) => {
                      field.onChange(e);//main 
                      debounced(e.target.value);
                    }}
                    />
                  </FormControl>
                  {isChekingUsername && <Loader2 className="animate-spin" />}
                  <p className={`text-sm ${usernameMessage === "Username is availble" ? 'text-green-500' : 'text-red-500'}`}>{usernameMessage}</p>
                  <FormMessage />
                </FormItem>
              )}  
            />
            <FormField
              control={form.control}
              name="email"
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
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                  </>
                ): ('Sign Up')
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Alread a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sing in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupForm;