'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Pencil, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signingIn , setSigningIn] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const loadingToastId = toast.loading("Signing in...");
    setSigningIn(true);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    toast.dismiss(loadingToastId);
    setSigningIn(false);
    if(res?.ok){
      toast.success("Signed in successfully.");
      router.push("/home");
    }else {
      toast.error(res?.error || "An error occurred. Please try again.");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-white dark:bg-gray-800 shadow-sm">
        <Link className="flex items-center justify-center" href="/">
          <Pencil className="h-6 w-6 text-gray-800 dark:text-gray-200" />
          <span className="ml-2 text-2xl font-bold text-gray-800 dark:text-gray-200">Blogify</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Sign in to Blogify</CardTitle>
            <CardDescription className="text-center">Welcome back! Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-300">Remember me</Label>
                </div>
                <Link href="#" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full">Sign In</Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-blue-600 hover:underline dark:text-blue-400">
                Sign up
              </Link>
            </p>
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </CardFooter>
        </Card>
      </main>
      <footer className="py-6 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">© 2023 Blogify. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
            <Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 transition-colors" href="#">
              Terms of Service
            </Link>
            <Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 transition-colors" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

