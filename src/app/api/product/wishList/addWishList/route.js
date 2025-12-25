 
import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req,res) {
    try{
        const { searchParams }= new URL(req.url)
        const productId= searchParams.get("id")
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
                AND: [
                    { productId: productId },
                    { userId: userId }
                ]
            }
         })
          

         if(findWshList.length>0){
            return NextResponse.json({status:"fail",msg:"wishlist already added"})
         }

          
         const addWishList = await prisma.wishlist.create({
            data:{
                productId:productId,
                userId:userId
            }
         })

          


        return NextResponse.json({status:"success",token:addWishList})



    }
    catch(e){
        return NextResponse.json({status:"fail",msg:"something went wrong"})
    }
    
}