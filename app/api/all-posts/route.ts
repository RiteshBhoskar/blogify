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
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    }
                }
            }
        })

        const postsWithLikeCount = allPosts.map(post => ({
            ...post,
            likeCount: post._count.likes,
            commentCount: post._count.comments,
        }));

        return NextResponse.json(postsWithLikeCount , { status: 200 });
    } catch(error) {
        console.error("Error while getting all posts.", error);
        return NextResponse.json({ error: "Something went wrong on the backend."}, { status: 500})
    }
}