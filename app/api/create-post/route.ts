import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const Categories = Object.values(Category)  as [string, ...string[]];

const blogSchema = z.object({
    title: z.string().min(7,"The title should be at least 7 characters.").max(255, "The title should not be more than 255 characters.").trim(),
    category: z.enum(Categories),
    content: z.string().min(10, "The content should be at least 10 characters.").max(10000, "The content should not be more than 10000 characters.")
})

export async function POST(req: NextRequest) {

 try {
    const res = await req.json();

    const session = await getServerSession(authOptions);

    if(!session?.user.id){
        return NextResponse.json({
            error: "Unauthorized log in."
        } , { status: 401 })
    }

    const userId  = session.user.id;

    const result = blogSchema.safeParse(res);

    if(!result.success){
        return NextResponse.json({ error: result.error.errors }, { status: 400 })
    }

    const { title , category , content } = result.data;

    const post = await prisma.blog.create(
        {
            data: {
                title,
                category :category as Category,
                content,
                author: {
                    connect: {
                        id: userId
                    },
                },
            },
        }
    )

    if(!post) {
        return NextResponse.json({ error: "Could not create the blog."} , { status: 400});
    }

    return NextResponse.json({ message: "Blog published successfully."}, { status: 201})

  } catch(error) {
    console.error("This is the error:",error);
    return NextResponse.json({
        error: "An unexpected error occurred while creating the blog."
    } , { status: 500 });
  }
}