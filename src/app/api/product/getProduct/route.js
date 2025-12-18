import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req,res){
    try{
        const response = await prisma.product.findMany()
        if(!response){
            return NextResponse.json({status:"fail",msg:"No product found"},{status:404})
        }
        return NextResponse.json({status:"success",msg:"Product fetches successfully",data:response},{status:200})

    }
    catch(e){
        return NextResponse.json({status:"fail",msg:"something went wrong"},{status:500})
    }
}