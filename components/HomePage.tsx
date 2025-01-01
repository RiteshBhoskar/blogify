

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import BloggingSidebar from './Sidebar'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default function HomePage() {
    return (
        <BloggingSidebar>
            <MainHomePage />
        </BloggingSidebar>
    )
}

async function MainHomePage() {
    const session = await getServerSession(authOptions);
  const recentPosts = [
    { id: 1, title: "Getting Started with Blogify", excerpt: "Learn how to make the most of your Blogify experience..." },
    { id: 2, title: "10 Tips for Better Blog Writing", excerpt: "Improve your writing skills with these essential tips..." },
    { id: 3, title: "Understanding SEO for Bloggers", excerpt: "Boost your blog's visibility with these SEO strategies..." },
  ]

  const feedPosts = [
    { id: 1, author: "Jane Doe", title: "The Future of AI in Content Creation", likes: 42, comments: 15 },
    { id: 2, author: "John Smith", title: "Mastering the Art of Storytelling", likes: 38, comments: 22 },
    { id: 3, author: "Alice Johnson", title: "Sustainable Living: Small Changes, Big Impact", likes: 56, comments: 30 },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome back, {session?.user.name}</h2>
      
      {/* Quick post creation */}
      <Card>
        <CardHeader>
          <CardTitle>What's on your mind?</CardTitle>
          <CardDescription>Share your thoughts with the Blogify community</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex space-x-2">
            <Input placeholder="Start writing..." className="flex-grow" />
            <Button type="submit">Post</Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent posts */}
      <Card>
        <CardHeader>
          <CardTitle>Your Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentPosts.map(post => (
              <li key={post.id}>
                <Link href={`/post/${post.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400">{post.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{post.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Your Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {feedPosts.map(post => (
              <li key={post.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                <Link href={`/post/${post.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{post.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">By {post.author}</p>
                  <div className="flex space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

