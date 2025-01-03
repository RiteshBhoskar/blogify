"use client"
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";


export default function () {
    const [content ,setContent] = useState("");
    const router = useRouter();
    return (
        <div>
            <form 
                className="flex space-x-2" 
                onSubmit={(e) => {
                e.preventDefault(); 
                if (content.trim()) {
                    router.push(`/home/create-post?title=${encodeURIComponent(content)}`);
                }
                }}
            >
                <Input
                placeholder="Start writing..."
                className="flex-grow"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                />
                <Button type="submit">Post</Button>
            </form>
        </div>
    )   
}