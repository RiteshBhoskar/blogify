'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Pencil, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    document.getElementById("name")?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    
    if (!name.trim()) {
      toast.warning("Full Name is required.");
      return;
    }

    if (!email.trim()) {
      toast.warning("Email is required.");
      return;
    }

    if (!password) {
      toast.warning("Password is required.");
      return;
    }

    if (!confirmPassword) {
      toast.warning("Please confirm your password.");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.warning("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      toast.warning("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Passwords do not match")
      return
    }

    setIsSubmitting(true);
    const signUpLoadingId = toast.loading("Signing up...");
    const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
           "Content-Type": "application/json"
          },
        body: JSON.stringify({ name, email, password }),
    });
    toast.dismiss(signUpLoadingId);
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error);
      setIsSubmitting(false);
      return
    } 

    toast.success(data.message);

    if(data.success) {
     setName("");
     setEmail("");
     setPassword("");
     setConfirmPassword("");
     document.getElementById("name")?.focus();
     const loadingToastId = toast.loading("Signing in...");

      const signInResponse  = await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/home",
      })

      toast.dismiss(loadingToastId);

      if(signInResponse?.error){
        toast.error(signInResponse.error);
        setIsSubmitting(false);
      }else {
        toast.success("Signed in successfully");
      }

    }else {
      toast.error(data.error);
      setIsSubmitting(false);
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
            <CardTitle className="text-2xl font-bold text-center">Sign Up for Blogify</CardTitle>
            <CardDescription className="text-center">Create your account and start blogging today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name"
                  type="name" 
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input 
                  id="confirm-password"
                  type="password" 
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <Button type="submit" className="w-full"
              disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing up...' : 'Sign Up'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/signin" 
              replace
              className="text-blue-600 hover:underline dark:text-blue-400">
                Log in
              </Link>
            </p>
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

