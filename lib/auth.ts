import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "./prisma";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const { email , password } = credentials || {};

                if(!email || !password) {
                    throw new Error("Invalid credentials.");
                }
                const user = await prisma.user.findUnique({
                    where: { email },
                })

                if(!user) {
                    throw new Error("User not found.");
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);

                if(!isPasswordValid) {
                    throw new Error("Invalid password.");
                }

                return { id: user.id, email: user.email, name: user.name || "" };
            },
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token , user }) {
            if(user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async session({ session , token }) {
            session.user = {
                id: token.id as string,
                email: token.email as string,
                name: token.name as string,
            };
            return session;
        }
    },
    
    secret: process.env.NEXTAUTH_SECRET,

} satisfies NextAuthOptions;