"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface Author {
    name: string;
}

interface Post {
    id: string;
    title: string;
    content: string;
    category: string;
    likeCount: number;
    commentCount: number;
    author: Author;
    likes: { id: string }[];
    comments: { id: string }[]; 
    likedByCurrentUser: boolean;
}
export default function Feed() {
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [loading , setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/all-posts");
        const data = await res.json();
        setLoading(false);
        setFeedPosts(data.slice(0, 3));
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };
    fetchFeedPosts();
  }, []);


const handleLike = async (postId: string) => {
    const loadingToastId = toast.loading("Updating the like...")
    try {
        const res = await fetch("/api/post-like", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ postId })
        })

        const data = await res.json();

        if(!res.ok){
            toast.dismiss(loadingToastId);
            toast.error(data.error || "Something went wrong.")
        }
        toast.dismiss(loadingToastId);
        toast.success(data.message);
        setFeedPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId
             ? { ...post, likeCount: data.likeCount ,   likedByCurrentUser: data.isLiked }
             : post
            )
        );
    } catch (error) {
        console.error("Error updating like:", error);
        toast.error("Something went wrong.");
    }
}
  const truncateContent = (content: string, maxLength: number) => {
    return content.length > maxLength
      ? `${content.slice(0, maxLength)}...`
      : content;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Feed</CardTitle>
      </CardHeader>
      <CardContent>
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    loading...
                </div>
            ): (
        <ul className="space-y-4">
          {feedPosts.map((post) => (
            <li key={post.id} className="border-b last:border-b-0 pb-4 last:pb-0">
              <Link
                href={`/post/${post.id}`}
                className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded"
              >
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {truncateContent(post.content, 150)}
                </p>
                <div className="flex space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>By {post.author.name} </span>
                </div>
              </Link>
              
              <div className="flex pl-3 space-x-7">
                  <button onClick={()=> handleLike(post.id)} className={`flex items-center space-x-1 ${
                    post.likedByCurrentUser ? "text-red-500" : "text-black"
                  }`}>
                    <Heart
                      className={`w-[18px] h-[18px] ${
                        post.likedByCurrentUser ? "fill-red-500" : "hover:fill-red-500"
                      }`} />
                    <span>{post.likeCount}</span>
                  </button>
                  <button className="flex items-center space-x-1">
                    <MessageCircle className="w-[18px] h-[18px]" />
                    <span>{post.commentCount}</span>
                  </button>
                </div>
            </li>
          ))}
         </ul>
        )}
      </CardContent>
      <CardFooter>
        <Link className="w-full rounded-md hover:bg-blue-300 text-base text-black hover:text-white py-2 flex justify-center" href="/home/all-posts" >
          Read more
        </Link>
      </CardFooter>
    </Card>
  );
}
