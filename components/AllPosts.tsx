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
    author: Author;
    likes: number;
    comments: number;
}

export default function AllPosts() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
            const res = await fetch("/api/all-posts")

            const data = await res.json();
            if(!data){
                toast.error("Couldn't fetch posts.");
            }
            setPosts(data);

            } catch(error) {
                console.error("Error fetching posts:", error);
            }
        }
        fetchPosts();
    } , [])

    const truncateContent = (content: string, length: number) => {
        if (content.length <= length) return content;
        return content.slice(0, length) + "...";
    };


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
                  <button className="flex items-center space-x-1">
                    <Heart className="w-5 h-5 hover:fill-red-500 hover:border-red-500" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments}</span>
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

