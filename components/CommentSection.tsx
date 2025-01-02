'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { toast } from 'sonner'
import { Heart } from 'lucide-react'

interface Author {
  name: string;
}

interface Comment {
  id: string;
  author: Author;
  content: string;
  likes: number;
  createdAt: string;
  likedByCurrentUser: boolean;
}

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

export function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) return;
    const loadingToastId = toast.loading("Posting comment...")
    try {
      const res = await fetch("/api/comment" , {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          postId,
          content: newComment
        })
      })

      const data = await res.json();
      if(!res.ok) {
        toast.dismiss(loadingToastId)
        toast.error(data.error || "Failed to add comment.")
      }

      setComments([...comments, data])
      setNewComment('');
      toast.dismiss(loadingToastId)
      toast.success(data.message)
    } catch (error) {
      toast.dismiss(loadingToastId)
      console.error("Error posting comment:", error);
      toast.error("Failed to add comment.")
    }
  };

  const handleCommentLike = async (commentId: string) => {
    const loadingToastId = toast.loading("Updating like...")
    try {
      const response = await fetch("/api/comment/likes", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ commentId })
      }) 
      toast.dismiss(loadingToastId)
      if(!response.ok) {
        toast.error("Failed to update like.")
      }

      const data = await response.json();
      if(data){
        toast.success(data.message)
      }
      setComments(comments.map(comment =>
        comment.id === commentId ? { ...comment, likes: data.likeCount, likedByCurrentUser: data.isLiked } : comment
      ));
    } catch (error) {
      console.error("Error updating like:", error);
      toast.error("Failed to update like.")
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Input
            placeholder="Add a comment..."
            required
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button type="submit">Post Comment</Button>
        </form>
        <Separator className="my-6" />
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{comment.author?.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-black font-medium">{comment.author?.name}</p>
                  <time className="text-xs text-gray-500" dateTime={comment.createdAt}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </time>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                <div className="flex items-center space-x-2">
                <button onClick={() => handleCommentLike(comment.id)} className="flex items-center space-x-1">
                  <Heart className={`w-4 h-4 ${comment.likedByCurrentUser ? 'fill-current text-rose-500' : ''}`} />
                  <span>{comment.likes}</span>
                </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

