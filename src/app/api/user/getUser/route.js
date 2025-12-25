 
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
 
export const dynamic = 'force-dynamic';

export async function POST(req,res){
    
    
    try{
        const data = await req.json();  
        const findUser = await prisma.user.findMany()
        if(!findUser){
            return NextResponse.json({
                status:"fail",msg:"user not found"
            })}
        return NextResponse.json({status:"success",data:findUser},{status:200})
        

    }
    catch(e){
        return NextResponse.json({error:"Internal Server Error"}, {status:500});
    }
}


 