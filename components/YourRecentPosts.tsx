"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import Link from "next/link";
import { Button } from "./ui/button";

interface Post {
    id: string;
    title: string;
    content: string;
}

export default function () {
    const [recentPosts , setRecentPosts] = useState<Post[]>([]);
    const [loading , setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentPosts = async () => {
            setLoading(true)
            try {
            const res = await fetch("/api/your-posts");
            const data = await res.json();
            setRecentPosts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchRecentPosts();
    }, []);

    const truncateContent = (content: string, maxLength: number) => {
        return content.length > maxLength
          ? `${content.slice(0, maxLength)}...`
          : content;
      };
    

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Recent Posts</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                <div className="text-center text-gray-600 dark:text-gray-300">
                    Loading...
                </div>
                ) : recentPosts.length > 0 ? (
                <ul className="space-y-2">
                    {recentPosts.map((post) => (
                    <li key={post.id}>
                        <Link
                        href={`/post/${post.id}`}
                        className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded"
                        >
                        <h3 className="font-semibold text-blue-600 dark:text-blue-400">
                            {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {truncateContent(post.content, 200)}
                        </p>
                        </Link>
                    </li>
                    ))}
                </ul>
                ) : (
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-300">
                    You have no recent posts. Start creating one!
                    </p>
                    <Link href="/home/create-post">
                    <Button className="mt-4" variant="secondary">
                        Create Post
                    </Button>
                    </Link>
                </div>
                )}
            </CardContent>
        </Card>
    )
}