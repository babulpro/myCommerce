import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req,res){
    try{
        const response = await prisma.category.findMany();
        if(!response){
            return NextResponse.json({status:"fail",msg:"No category found"},{status:404})
        }
        return NextResponse.json({status:"success",msg:"Category fetches successfully",data:response},{status:200})

    }
    catch(err){
        return NextResponse.json({status:"fail",msg:"Something went wrong"},{status:500})
    }
}