import { randomBytes } from "crypto";
import { db } from "./db";

export async function createUniqueHashedId(){
    let urlExists:boolean=true;
    do{
        const hashedId=generateRandomHash();
        const url =await db.url.findUnique({
            where:{
                hashedId:hashedId
            }
        })
        if(url){
            urlExists=true;
        }else{
            urlExists=false;
            return hashedId;
        }
    }while(urlExists)
}

function generateRandomHash(){
    return randomBytes(4).toString('hex');
}

