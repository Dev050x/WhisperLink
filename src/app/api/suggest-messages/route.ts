import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {


  try {
    const { messages } = await req.json();
  
    const prompt = "Generate three thought-provoking and inclusive questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be approachable for a broad audience. Focus on open-ended inquiries that spark curiosity, avoid sensitive or controversial topics, and promote friendly and meaningful conversations. For instance, your output could look like: 'If you could instantly master any skill, what would it be?||What book or movie had the biggest impact on you?||What’s the most unexpected lesson you’ve learned in life?'. Aim for questions that are engaging and create a positive space for dialogue.";

    // const prompt = "hey write some story";

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      maxTokens: 400,
      messages,
      prompt,
    });
    
    return result.toTextStreamResponse()
  } catch (error) {
    console.log("this is erorr message:",JSON.stringify(error.message));
    return NextResponse.json({
        message:"there is some error",
        error:error,
    },{status:400});
  }
}