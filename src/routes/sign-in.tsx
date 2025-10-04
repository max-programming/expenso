import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

export const Route = createFileRoute("/sign-in")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Sign in",
      },
    ],
  }),
});

function RouteComponent() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card shadow-xl px-8 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-semibold">Welcome back</h1>
          <p className="mt-3 text-muted-foreground">
            Log in to pick up where you left off and keep your finances on track.
          </p>
        </div>

        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Mail className="w-5 h-5" aria-hidden="true" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@email.com"
                autoComplete="email"
                className="w-full rounded-xl border border-border bg-background/60 py-3 pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Lock className="w-5 h-5" aria-hidden="true" />
              </span>
              <input
                id="password"
                name="password"
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-border bg-background/60 py-3 pl-11 pr-12 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
              >
                {isPasswordVisible ? (
                  <EyeOff className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Eye className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all"
          >
            Sign in
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-3 text-sm text-muted-foreground text-center">
          <p>
            New here?{' '}
            <Link
              to="/sign-up"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
