import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { CreateJwtToken } from "@/lib/authFunction/JwtHelper";

const dynamic = 'force-dynamic';

export async function POST(req,res){
    try{
        const data = await req.json();
       const findUser = await prisma.user.findUnique({
            where:{
                email:data.email
            }
       }) 

       if(findUser){
        return NextResponse.json({status:"fail",msg:"user already exists"},{stats:400})
       }
       const bcryptPassword = await bcrypt.hash(data.password,10)
       data.password= bcryptPassword;

       const user = await prisma.user.create({
            data:{
                name:data.name,
                email:data.email,
                password:data.password
            }
       })

       const token = await CreateJwtToken(user.role,user.id) 
       const response = NextResponse.json({status:"success",msg:"user created successfully"})

       response.cookies.set({
        name:"token",
        value:token,
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        path:"/",
        maxAge:60*60*24*7
       })
        
      return response;

       
    }
    catch(e){
        return NextResponse.json({error:"Internal Server Error"}, {status:500});
    }
}