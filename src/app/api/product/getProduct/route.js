import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req,res){
    try{
        const response = await prisma.product.findMany({
            where:{
                brand:null
            }
        })
        console.log("Fetched products:", response);
        if(!response){
            return NextResponse.json({status:"fail",msg:"No product found"},{status:404})
        }
        return NextResponse.json({status:"success",msg:"Product fetches successfully",data:response},{status:200})

    }
    catch(e){
        return NextResponse.json({status:"fail",msg:e.message},{status:500} )
    }
}










// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function GET(req,res){
//     try{
//         const response = await prisma.product.findMany()
//         console.log("Fetched products:", response);
//         // if(!response){
//         //     return NextResponse.json({status:"fail",msg:"No product found"},{status:404})
//         // }
//         return NextResponse.json({status:"success",msg:"Product fetches successfully",data:"response"},{status:200})

//     }
//     catch(e){
//         return NextResponse.json({status:"fail",msg:"something went wrong"},{status:500})
//     }
// }