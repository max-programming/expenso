import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, User, Globe } from 'lucide-react'
import { getCountriesAndCurrencies } from '../server/get-countries-and-currencies'

export const Route = createFileRoute('/sign-up')({
  component: RouteComponent,
  loader: async () => {
    const countriesAndCurrencies = await getCountriesAndCurrencies()
    return { countriesAndCurrencies }
  },
})

function RouteComponent() {
  const { countriesAndCurrencies } = Route.useLoaderData()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

  const sortedCountries = countriesAndCurrencies
    .map((country) => country.name.common)
    .sort((a, b) => a.localeCompare(b))

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-3xl gap-10 rounded-3xl border border-border bg-card shadow-xl p-8">
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-semibold mb-3">Create your account</h1>
          <p className="text-muted-foreground mb-8">
            Start monitoring your spending habits and unlock insights tailored to
            your financial goals.
          </p>

          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault()
            }}
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                User name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <User className="w-5 h-5" aria-hidden="true" />
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  autoComplete="name"
                  className="w-full rounded-xl border border-border bg-background/60 py-3 pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

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
                htmlFor="country"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                Country
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none">
                  <Globe className="w-5 h-5" aria-hidden="true" />
                </span>
                <select
                  id="country"
                  name="country"
                  autoComplete="country"
                  className="w-full rounded-xl border border-border bg-background/60 py-3 pl-11 pr-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                >
                  <option value="">Select your country</option>
                  {sortedCountries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
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
                  placeholder="Create a strong password"
                  autoComplete="new-password"
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

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                Confirm password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Lock className="w-5 h-5" aria-hidden="true" />
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={isConfirmPasswordVisible ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-border bg-background/60 py-3 pl-11 pr-12 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
                  className="absolute inset-y-0 right-2 flex items-center px-2 text-muted-foreground hover:text-primary transition-colors"
                  aria-label={
                    isConfirmPasswordVisible
                      ? 'Hide confirmation password'
                      : 'Show confirmation password'
                  }
                >
                  {isConfirmPasswordVisible ? (
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
              Sign up
            </button>
          </form>

          <p className="text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link
              to="/sign-in"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
