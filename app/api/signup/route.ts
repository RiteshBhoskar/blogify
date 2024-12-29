import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";


export async function POST(req: NextRequest) {
    const authSchema = z.object({
        name: z.string()
            .min(3,"Name must be at least 3 characters long.")
            .max(255, "Name must be at most 255 characters long.")
            .trim(),
        email: z.string()
            .email("Invalid email address.")
            .trim(),
        password: z.string()
            .min(6,"Password must be at least 6 characters long.")
            .max(255, "Name must be at most 255 characters long.")
            .trim(),
    })

  try {
    const response = await req.json();

    const { name , email , password } = authSchema.parse(response);

    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    if(existingUser) {
        return NextResponse.json({ error: "User already exists with this email." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    })

    if(!user) {
        return NextResponse.json({ error: "Database operation failed." }, { status: 500 });
    }

    return NextResponse.json({success: true , message: "User created successfully." }, { status: 201 });

  } catch (error: any) {
    console.error(error);

    if(error.name === "ZodError") {
        return NextResponse.json({ error: "Invalid Input.", details: error.errors}, { status: 422 });
    }

    return NextResponse.json({ error: "An unexpected error occurred. Please try again later." }, { status: 500 });
  }
}