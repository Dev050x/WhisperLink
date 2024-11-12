import { Message } from "@/model/User";

//type safety for sendverification mail
export interface ApiResponse{
    success:boolean,
    message:string,
    isAcceptingMessage?: boolean,
    messages?:Array<Message>,
}
