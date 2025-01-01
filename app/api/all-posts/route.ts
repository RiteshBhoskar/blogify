import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const allPosts = await prisma.blog.findMany({
            include: {
                author: {
                    select: {
                        name: true,
                    }
                }
            }
        })
        return NextResponse.json(allPosts , { status: 200 });
    } catch(error) {
        console.error("Error while getting all posts.", error);
        return NextResponse.json({ error: "Something went wrong on the backend."}, { status: 500})
    }
}