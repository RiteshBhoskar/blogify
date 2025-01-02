import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest) {

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "You must be logged in to like a comment." }, { status: 401 });
    }
    const data  = await req.json();
    const { commentId } = data;
    if (!commentId) {
        return NextResponse.json({ error: "Missing commentId." }, { status: 400 });
    }

    const userId = session.user.id;

    try { 
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_commentId: {
                    userId: userId,
                    commentId: commentId
                }
            }
        })

        if(existingLike){
            await prisma.like.delete({
                where: {
                    userId_commentId: {
                        userId: userId,
                        commentId: commentId
                    }
                }
            })
            const likeCount = await prisma.like.count({
                where: { commentId: commentId }
            });
            return NextResponse.json({ message: "Unliked the comment." , likeCount , isLiked: false}, { status: 200})
        } else {
            await prisma.like.create({
                data: {
                    userId: userId,
                    commentId: commentId
                }
            })
            const likeCount = await prisma.like.count({
                where: { commentId: commentId }
            });
            return NextResponse.json({ message: "Liked the comment." , likeCount ,  isLiked: true} , { status: 201 })
        }
    } catch(error) {
        console.error("Error deleting like:", error);
        return NextResponse.json({ error: "Failed to unlike comment." }, { status: 500 });
    }
}