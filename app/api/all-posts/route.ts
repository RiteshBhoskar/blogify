import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

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
                },
                likes: {
                    where: { userId: userId}
                }
            }
        })

        const postsWithLikeCount = allPosts.map(post => ({
            ...post,
            likeCount: post._count.likes,
            commentCount: post._count.comments,
            likedByCurrentUser: post.likes.length > 0,
        }));

        return NextResponse.json(postsWithLikeCount , { status: 200 });
    } catch(error) {
        console.error("Error while getting all posts.", error);
        return NextResponse.json({ error: "Something went wrong on the backend."}, { status: 500})
    }
}