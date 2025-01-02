import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const data = await req.json();

    if(!session?.user.id){
        return NextResponse.json({ error: "You are unauthenticated."})
    }
    const userId = session.user.id;
    const { postId } = data;

    try {
        const blogPost = await prisma.blog.findUnique({
            where: { id: postId }
        });

        if (!blogPost) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }
        
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_blogId: {
                    userId,
                    blogId: postId,
                }
            }
        })
        if(existingLike){
            await prisma.like.delete({
                where: {
                    userId_blogId: {
                        userId,
                        blogId: postId
                    }
                }
            })
            const likeCount = await prisma.like.count({
                where: { blogId: postId },
              });
              
              return NextResponse.json({ message: "Unliked the post." , likeCount , isLiked: false}, { status: 200})
        } else {
            await prisma.like.create({
                data: {
                    userId,
                    blogId: postId,
                }
            })
            
            const likeCount = await prisma.like.count({
                where: { blogId: postId },
              });
              
              return NextResponse.json({ message: "Liked the post." , likeCount ,  isLiked: true} , { status: 201 })
        }
    } catch (error) {
        console.error("Error updating like:", error);
        return NextResponse.json({ error: "Post not found or update failed"}, { status: 404});
    }

}