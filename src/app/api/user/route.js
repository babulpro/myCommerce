 
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req,res){
    try{
        const prisma = new PrismaClient();
        const users = await prisma.user.findMany();
        return NextResponse.json(users, {status:200});

    }
    catch(e){
        return NextResponse.json({message:"Internal Server Error"}, {status:500});
    }
}