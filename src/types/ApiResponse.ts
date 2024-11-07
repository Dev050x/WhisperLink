import { Message } from "@/model/User";

//type safety for sendverification mail
export interface ApiResponse{
    success:boolean,
    message:string,
    isAcceptingMessages?: boolean,
    messages?:Array<Message>,
}
