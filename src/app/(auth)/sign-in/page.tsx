'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchemaValidation } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiResponse"
//for this page we are using shadcn fomr component


const page = () => {
  const [username,setUsername] = useState('');
  //for username is availble or not
  const [usernameMessage, setUsernameMessage] = useState('');
  //for loader for cheking username(while cheking the unqiqueness of username)
  //both field are  for loader
  const [isChekingUsername, setIsChekingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  //debouncing library usehooks-ts
  const debouncedUsername = useDebounceValue(username , 300);
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
      if(debouncedUsername){
        setIsChekingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
        }finally{
          setIsChekingUsername(false);
        }
      }
    }
    checkUsernameUnique();

  } ,[debouncedUsername]);





  return (
    
    <div>page</div>
  )
}

export default page