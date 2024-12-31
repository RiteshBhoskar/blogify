import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Feather, Share2, Zap, ArrowRight } from 'lucide-react'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-gray-900 dark:text-gray-50">
                  Welcome to Blogify
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Your all-in-one platform for creating, sharing, and discovering amazing blog content.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg">Get Started</Button>
                <Button size="lg" variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-gray-900 dark:text-gray-50">Features</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Feather, title: "Easy Writing", description: "Intuitive editor with markdown support for effortless content creation." },
                { icon: Share2, title: "Seamless Sharing", description: "Share your posts across multiple platforms with a single click." },
                { icon: Zap, title: "Powerful Analytics", description: "Gain insights into your audience and track your blog's performance." },
              ].map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <feature.icon className="h-10 w-10 text-gray-600 dark:text-gray-300 mb-2" />
                    <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-gray-900 dark:text-gray-50">Testimonials</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Alex Johnson",
                  role: "Tech Blogger",
                  content: "Blogify has revolutionized my writing process. It's intuitive, powerful, and helps me reach a wider audience.",
                },
                {
                  name: "Sarah Lee",
                  role: "Food Critic",
                  content: "The analytics feature in Blogify has been a game-changer for understanding my audience and growing my blog.",
                },
                {
                  name: "Michael Brown",
                  role: "Travel Writer",
                  content: "I love how easy it is to share my posts across different platforms. Blogify has significantly increased my reach.",
                },
              ].map((testimonial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">{testimonial.name}</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900 dark:text-gray-50">Start Your Blogging Journey Today</h2>
                <p className="mx-auto max-w-[600px] text-xl/relaxed text-gray-600 dark:text-gray-300">
                  Join thousands of writers and creators on Blogify. Sign up now and get your first month free!
                </p>
              </div>
              <Link href="/signup" passHref>
                <Button size="lg" className="mt-6">
                  Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Already have an account? <Link href="/signin" className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-gray-50 transition-colors">Log in</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

