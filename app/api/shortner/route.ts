import { db } from "@/app/lib/db";
import { createUniqueHashedId } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import {z} from 'zod'


const urlSchema=z.object({
    longUrl:z.string().url({message:"Invalid URL"})
})

export async function POST(req:NextRequest){
    try{
        const data=await req.json();
        console.log(data)
        // const url:string=data.longUrl;
        if(data.longUrl===""){
            return NextResponse.json({
                message:"No Url Entered"
            },{
                status:400
            })
        }

        const validation=urlSchema.safeParse(data);
        if(!validation.success){
            return NextResponse.json({
                message:validation.error.issues[0].message
            },{
                status:400
            })
        }

        const hashedId:string=await createUniqueHashedId() || "";
        const shortUrl:string=process.env.APP_URL+hashedId;
        await db.url.create({
            data:{
                longUrl:validation.data.longUrl,
                shortUrl:shortUrl,
                hashedId:hashedId || "",
                createdAt:new Date()
            }
        })
        return NextResponse.json({
            shortUrl:shortUrl,
            originalUrl:validation.data.longUrl,
            createdAt:new Date().toISOString()
        },{
            status:201
        })
    }catch(e){
        return NextResponse.json({message:(e as Error)?.message},{status:500})
    }
}

export async function GET(req:NextRequest){
    try{
        const urlId=req.nextUrl.searchParams.get('hashedId');
        if(!urlId){
            return NextResponse.json({
                message:"No URL ID Provided"
            },{
                status:400
            })
        }
        const url=await db.url.findUnique({
            where:{
                hashedId:urlId
            }
        })
        if(url){
            return NextResponse.json({longUrl:url.longUrl})
        }else{
            return NextResponse.json({
                message:"URL Not Found"
            },{
                status:404
            })
        }
    }catch(e){
        return NextResponse.json({message:(e as Error)?.message},{status:500})
    }
}