'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter} from 'next/navigation'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageCircle, Share2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { CommentSection } from '@/components/CommentSection'

interface Author {
    name: string;
}

interface Comment {
  id: string; 
  author: Author;
  content: string;
  likes: number;
  createdAt: string;
}

interface Post {
    id: string;
    title: string;
    category: string;
    content: string;
    author: Author;
    createdAt: string;
    likeCount: number;
    comments: Comment[];
    likedByCurrentUser: boolean;
}


export default function BlogPostPage() {
  const params = useParams();
  const { id } = params;

  const [post, setPost] = useState<Post | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading , setLoading] = useState(false);

  const handleShare = () => {
    const currentUrl = window.location.href;

    if(navigator.share){
      navigator.share({
        title: post?.title || "Check out this blog post",
        url: currentUrl
      }).catch((error) => {
        console.error("Error sharing:", error)
      })
    } else {
      navigator.clipboard.writeText(currentUrl).then(() => {
        toast.success("Link copied to clipboard.")
      }).catch((error) => {
        console.error("Error copying link to clipboard:", error)
      })
    }
  }

  useEffect(() => {
    if(!id) return;

    const fetchPost = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/post/?id=${id}`);
            if(!res.ok){
                toast.error("Failed to fetch the post.")
            }
            const data = await res.json();
            setLoading(false)
            setPost(data);
            setIsLiked(data.likedByCurrentUser)
        } catch (error) {
            setLoading(false)
            toast.error("Could not fetch the post. Please try again.");
            console.error("Error fetching post:", error);
        }
    }
    fetchPost();
  }, [id])

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
            toast.error(data.error || "Failed to update like.")
        }
        toast.dismiss(loadingToastId);
        toast.success(data.message);
        if(post){
            setPost({...post, likeCount: data.likeCount, likedByCurrentUser: data.isLiked});
            setIsLiked(data.isLiked)
        }
    } catch (error) {
        toast.error("Could not update like. Please try again.");
        console.error("Error updating like:", error);
    }
}

if (loading) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-center text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-center text-gray-600">Post not found.</p>
      </div>
    );
  }



  return (
    <div className="container mx-auto py-10">
      <Link href={"/home/all-posts"} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to All Posts
      </Link>
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{post.category}</Badge>
            <time dateTime={post.createdAt} className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{post.author?.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.author?.name || "Unknown Author"}</p>
              <p className="text-sm text-gray-500">Author</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          <Separator />
          <div className="flex justify-between items-center w-full">
            <div className="flex space-x-4">
              <button
                className={`flex items-center space-x-2 ${isLiked ? 'text-red-500' : ''}`}
                onClick={() => handleLike(post?.id)}
              >
                <Heart className={`w-[18px] h-[18px] ${isLiked ? 'fill-current' : ''}`} />
                <span>{post.likeCount}</span>
              </button>
            </div>
            <Button variant="ghost" size="sm" className="flex items-center space-x-1" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
      <CommentSection initialComments={post.comments} postId={post.id} />
    </div>
  )
}

