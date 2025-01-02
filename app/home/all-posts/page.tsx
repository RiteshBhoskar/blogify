import AllPosts from "@/components/AllPosts";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";


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
        <AllPosts />
    )
}