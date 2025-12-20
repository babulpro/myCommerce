import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req,res){
    try{
        const {searchParams}= new URL(req.url)
        const categoryId = searchParams.get("id");
        const productByCategory=await prisma.product.findMany({
            where:{
                categoryId:categoryId
            }
        })
        
        if(!productByCategory){
            return NextResponse.json({status:"fail",msg:"No product found for this category"},{status:404})
        }

        return NextResponse.json({status:"success",data:productByCategory},{status:200})
    }
    catch(e){
        return NextResponse.json({status:"fail",msg:"Something went wrong"},{status:5000})
    }
}