import { SignIn } from "@clerk/nextjs";
import { Workflow } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex flex-col items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Workflow className="h-7 w-7 text-white" />
          </div>
          <span className="text-3xl font-bold text-white">LegalFlow</span>
        </Link>

        {/* Sign In Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue to your dashboard</p>
          </div>
          
          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none",
              },
            }}
          />
        </div>

        {/* Footer */}
        <p className="text-center text-white/80 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-semibold text-white hover:text-white/90 underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
