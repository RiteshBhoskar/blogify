import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){
    const session = await getServerSession(authOptions);

    if(!session){
        return NextResponse.json({ error: "Unauthenticated User"} , { status: 401})
    }

    const userId = session.user.id;

    const { postId , content } = await req.json();

    if (!postId || !content) {
        return NextResponse.json({ error: "Post ID and content are required" }, { status: 400 });
    }

    try {
        const newComment = await prisma.comment.create({
            data: {
                content,
                userId,
                blogId: postId
            },
            include: {
                user: {
                    select: {
                        name: true,
                    }
                }
            }
        })
        return NextResponse.json({ 
            id: newComment.id,
            content: newComment.content,
            createdAt: newComment.createdAt,
            likes: 0,
            author: {
                name: newComment.user.name
            },
            message: "Comment added successfully."
        }, { status: 201 });
    } catch (error) {
        console.error("Error adding comment:", error);
        return NextResponse.json({ error: "Failed to add comment." }, { status: 500 });
    }
}