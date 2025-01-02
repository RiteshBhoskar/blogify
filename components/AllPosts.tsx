"use client"
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Author {
    name: string;
    avatar?: string | null;
}

interface Post {
    id: string;
    title: string;
    content: string;
    category: string;
    likeCount: number;
    commentCount: number;
    author: Author;
    likes: number;
    comments: number;
    likedByCurrentUser: boolean;
}

export default function AllPosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
            const res = await fetch("/api/all-posts")

            const data = await res.json();
            if(!data){
                toast.error("Couldn't fetch posts.");
            }
            setLoading(false);
            setPosts(data);

            } catch(error) {
                setLoading(false)
                console.error("Error fetching posts:", error);
            }
        }
        fetchPosts();
    } , [])

    const truncateContent = (content: string, length: number) => {
        if (content.length <= length) return content;
        return content.slice(0, length) + "...";
    };

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
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                 ? { ...post, likes: data.likeCount ,   likedByCurrentUser: !post.likedByCurrentUser }
                 : post
                )
            );
        } catch (error) {
            console.error("Error updating like:", error);
            toast.error("Something went wrong.");
        }
    }
    
    if (loading) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex justify-center items-center">
                    <div className="loader">Loading...</div>
                </div>
            </div>
        );
    }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">All Posts</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-2xl">{post.title}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author.avatar || ''} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{post.author.name}</span>
                </div>
              </div>
              <Badge 
              className='w-fit'
              variant="secondary">{post.category}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                {truncateContent(post.content , 350)}
              </p>
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-4">
              <Separator />
              <div className="flex justify-between items-center w-full">
                <div className="flex space-x-7">
                  <button onClick={()=> handleLike(post.id)} className={`flex items-center space-x-1 ${
                    post.likedByCurrentUser ? "text-red-500" : "text-black"
                  }`}>
                    <Heart
                      className={`w-5 h-5 ${
                        post.likedByCurrentUser ? "fill-red-500" : "hover:fill-red-500"
                      }`} />
                    <span>{post.likeCount}</span>
                  </button>
                  <button className="flex items-center space-x-1">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.commentCount}</span>
                  </button>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/post/${post.id}`}>Read More</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

