import AllPosts from "@/components/AllPosts";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";


export default async function () {
        const session = await getServerSession(authOptions);
        if (!session) {
            return {
                redirect: {
                    destination: "/",
                    permanent: false,
                },
            };
        }
    return (
        <div>
            <div className="pt-5 pl-5">
            <Button variant="secondary">
                <Link href="/home">
                 Back
                </Link>
            </Button>
            </div>
            <AllPosts />
        </div>
    )
}