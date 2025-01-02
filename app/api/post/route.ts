import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req : NextRequest) {
    const session = await getServerSession(authOptions);

    if(!session){
        return NextResponse.json({ error: "Unauthenticated User"} , { status: 401})
    }

    const userId = session.user.id;

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
                comments: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        user: {
                            select: {
                                name: true
                            }
                        },
                        likes: {
                            select: {
                                userId: true,
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        likes:true,
                        comments: true,
                    }
                },
                likes: {
                    where: {
                        userId: userId
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
        likedByCurrentUser: post.likes.length > 0,
        comments: post.comments.map(comment => ({
            ...comment,
            author: {
                name: comment.user.name
            },
            likes: comment.likes.length,
            likedByCurrentUser: comment.likes.some(like => like.userId === userId)
        }))
      }

        return NextResponse.json( postWithCounts  , { status: 200 });

    } catch(error) {
        console.error("Error while fetching the single post:", error);
        return NextResponse.json({ error : "Something went wrong while fetching the post."}, { status: 500})
    }
}