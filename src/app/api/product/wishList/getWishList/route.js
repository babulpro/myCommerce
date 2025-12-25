import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req,res) {
    try{
        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value
        if(!token){
                return NextResponse.json({status:"fail",msg:"token not found"})
                }
        const payload = await DecodedJwtToken(token)
        const userId =payload.id 
        const findUser = await prisma.user.findUnique({
            where:{
                id:userId
            }
         })
         if(!findUser){
            return NextResponse.json({status:"fail",msg:"user not found"})
         }

         const findWshList = await prisma.wishlist.findMany({
            where:{
                userId:userId                
            },
            include:{
                product:true
            }
         })

         return NextResponse.json({status:"success",data:findWshList})
          
        

    }
    catch(e){
        return NextResponse.json({status:"fail",msg:"something went wrong"})
    }
    
}