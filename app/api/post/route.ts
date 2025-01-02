import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req : NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if(!id){
        return NextResponse.json({ error: "Post Id is required."} , { status: 400 });
    }

    try {
        const post = await prisma.blog.findUnique({
            where: {
                id: id,
            },
            include: {
                author: {
                    select: {
                        name: true,
                    }
                },
                _count: {
                    select: {
                        likes:true,
                        comments: true,
                    }
                }
            }
        })


        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

      const postWithCounts = {
        ...post,
        likeCount: post._count.likes,
        commentCount: post._count.comments,
      }

        return NextResponse.json( postWithCounts  , { status: 200 });

    } catch(error) {
        console.error("Error while fetching the single post:", error);
        return NextResponse.json({ error : "Something went wrong while fetching the post."}, { status: 500})
    }
}