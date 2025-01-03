import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if(!session){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const userId = session.user.id;

    const userPosts = await prisma.blog.findMany({
        where: {
            authorId: userId
        },
        orderBy: {
            createdAt: "desc"
        },
        take: 3
    })

    if (!userPosts || userPosts.length === 0) {
        return NextResponse.json({ error: "No posts found" }, { status: 404 });
    }

    return NextResponse.json(userPosts, {status: 200});
  } catch(error) {
    console.error(error)
    return NextResponse.json({ error: "Something went wrong." }, {status: 500});
  }

}