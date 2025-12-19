import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req,res){
    const {searchParams} = new URL(req.url);
    const id= searchParams.get("id");
    try{
        const product= await prisma.product.findUnique({
            where:{id:id}
        })

        return NextResponse.json({status:"success",data:product},{status:200});

    }
    catch(e){
        return NextResponse.json({status:"fail",msg:"something went wrong"})
    }
        
}