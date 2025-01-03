import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import BloggingSidebar from './Sidebar'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import PostRedirect from './PostRedirect'
import YourRecentPosts from './YourRecentPosts'
import YourFeed from './YourFeed'

export default function HomePage() {
    return (
        <BloggingSidebar>
            <MainHomePage />
        </BloggingSidebar>
    )
}

async function MainHomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome back, {session?.user.name}</h2>
      <Card>
        <CardHeader>
          <CardTitle>What's on your mind?</CardTitle>
          <CardDescription>Share your thoughts with the Blogify community</CardDescription>
        </CardHeader>
        <CardContent>
          <PostRedirect />
        </CardContent>
      </Card>
      
      <div>
        <YourRecentPosts />
      </div>

      <div>
        <YourFeed />
      </div>
    </div>
  )
}
