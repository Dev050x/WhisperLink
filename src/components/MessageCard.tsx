'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/User"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import dayjs from 'dayjs';
  
type MessageCardProps = {
    message: Message;
    onMessageDelete:(messageId:string) => void;
}
const MessageCard = ({message , onMessageDelete}:MessageCardProps) => {
  const {toast} = useToast()
  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
    console.log(response.data.message);
    toast({
        title:response.data.message,
    })
    onMessageDelete(message._id);
  }
  return (
    <Card className="card-bordered">
        <CardHeader>
            <div className="flex justify-between items-center">
            <CardTitle>{message.content}</CardTitle>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center justify-center bg-red-500 text-white p-3 rounded-md hover:bg-red-600 active:bg-red-700 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-red-400">
                    <X className="w-5 h-5" />
                </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} >Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            </div>
            <div className="text-sm">
                {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
            </div>
        </CardHeader>
        <CardContent>
        </CardContent>
        <CardFooter>
        </CardFooter>
    </Card>

  )
}

export default MessageCard