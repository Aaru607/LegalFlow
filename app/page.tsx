import Link from "next/link";
import { ArrowRight, CheckCircle2, Lock, Workflow } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        <div className="relative">
          {/* Navigation */}
          <nav className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Workflow className="h-8 w-8 text-white" />
                <span className="text-2xl font-bold text-white">LegalFlow</span>
              </div>
              <div className="flex gap-4">
                <Link 
                  href="/sign-in"
                  className="px-6 py-2 text-white hover:text-gray-200 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up"
                  className="px-6 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="container mx-auto px-6 py-24 md:py-32">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Smart Task Management
                <br />
                <span className="bg-gradient-to-r from-yellow-200 to-pink-300 bg-clip-text text-transparent">
                  With Dependency Control
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-2xl mx-auto">
                Prevent logical errors in your legal workflows. Never bill a client before closing the case again.
              </p>
              <Link 
                href="/sign-up"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Why LegalFlow?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <Workflow className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Topological Sorting</h3>
              <p className="text-gray-600">
                Tasks automatically ordered by dependencies using Kahn's Algorithm. No more manual sorting.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Cycle Detection</h3>
              <p className="text-gray-600">
                Prevents circular dependencies. System alerts you before creating infinite loops.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Smart Locking</h3>
              <p className="text-gray-600">
                Tasks lock automatically until dependencies are complete. Foolproof workflow execution.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to streamline your workflows?
          </h2>
          <p className="text-xl text-gray-100 mb-10 max-w-2xl mx-auto">
            Join legal teams who trust LegalFlow for mission-critical task management.
          </p>
          <Link 
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
          >
            Get Started Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400 text-center">
        <div className="container mx-auto px-6">
          <p>© 2026 LegalFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
