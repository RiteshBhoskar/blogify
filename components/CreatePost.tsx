'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'

const Categories = [
  "TECHNOLOGY",
  "LIFESTYLE",
  "EDUCATION",
  "BUSINESS",
  "ENTERTAINMENT",
  "HEALTH",
  "FITNESS",
  "FOOD",
  "TRAVEL",
  "FASHION",
  "FINANCE",
  "ART",
  "MUSIC",
  "SCIENCE",
  "HISTORY",
  "POLITICS",
  "SPORTS",
  "PERSONAL",
  "RELATIONSHIPS",
  "PARENTING",
  "CULTURE",
  "NATURE",
  "DIY",
  "BOOKS",
  "PHOTOGRAPHY",
  "GAMING",
  "SPIRITUALITY",
  "SELF_HELP",
  "NEWS",
];


export default function CreatePostPage() {
  const router = useRouter()
  const searchParams  = useSearchParams();
  const initialTitle = searchParams.get("title") || "";

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [isLoading , setIsLoading] = useState(false);

  useEffect(() => {
    if(initialTitle){
      setTitle(initialTitle)
    }
  }, [initialTitle])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToastId = toast.loading("Publishing the blog...");
    if (!title || !category || !content) {
      toast.dismiss(loadingToastId)
      setIsLoading(false);
      return toast.error("All fields are required.");
    }  
      try {
        const res = await fetch("/api/create-post" ,{
          method: "POST",
          headers: {
            "Content-Type" : "application/json"
          },
          body: JSON.stringify({ title , category , content })
        })

        const data = await res.json();

        if(!res.ok){
          setIsLoading(false);
          toast.dismiss(loadingToastId)
          return toast.error(data.error);
        }
        
        toast.dismiss(loadingToastId)
        toast.success(data.message)
        setTitle("")
        setCategory("")
        setContent("")
        setIsLoading(false)
      } catch(error) {
        setIsLoading(false);
        toast.dismiss(loadingToastId);
        toast.error("An unexpected error occured. Please try again.")
        console.log("Submission Error:", error)
      }
  }

  return (
    <div className="container px-2 mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className='text-xl'>Create New Blog Post</CardTitle>
          <CardDescription>Share your thoughts with the Blogify community</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter your blog post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}  required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {Categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0) + category.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your blog post content here"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="min-h-[200px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>Back</Button>
            <Button type="submit"
            disabled={isLoading}
             >
              {isLoading ? "Publishing..." : "Publish Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

