import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Eye, EyeOff, Lock, Mail, User, Globe } from "lucide-react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCountryNames } from "../server/get-countries-and-currencies";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import z from "zod";
import { signUpUser } from "@/server/sign-up-user";

export const Route = createFileRoute("/sign-up")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Sign up",
      },
    ],
  }),
  loader: () => getCountryNames(),
});

type SignUpForm = z.infer<typeof signUpForm>;
const signUpForm = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email(),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters long" }),
  passwordRepeat: z
    .string()
    .min(4, { message: "Password must be at least 4 characters long" }),
  country: z.string().min(1, { message: "Country is required" }),
});

function RouteComponent() {
  const navigate = useNavigate();
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpForm),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordRepeat: "",
      country: "",
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  async function onSubmit(data: SignUpForm) {
    if (data.password !== data.passwordRepeat) {
      form.setError("passwordRepeat", { message: "Passwords do not match" });
      return;
    }

    try {
      const response = await signUpUser({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
          country: data.country,
        },
      });

      if (response.success) {
        navigate({ to: "/sign-in" });
      }
    } catch (err) {
      if (err instanceof Error) {
        form.setError("root", { message: err.message });
      }
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-4xl">Create your account</CardTitle>
          <CardDescription className="text-base">
            Start monitoring your spending habits and unlock insights tailored
            to your financial goals.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FormProvider {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="name">User name</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <User className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jane Doe"
                    autoComplete="name"
                    className="pl-10"
                    {...form.register("name")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Mail className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@email.com"
                    autoComplete="email"
                    className="pl-10"
                    {...form.register("email")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none z-10">
                    <Globe className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <CountriesDropdown />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Lock className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <Input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    className="pl-10 pr-10"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(prev => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      isPasswordVisible ? "Hide password" : "Show password"
                    }
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Lock className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <Input
                    id="confirmPassword"
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    className="pl-10 pr-10"
                    {...form.register("passwordRepeat")}
                  />
                  <button
                    type="button"
                    onClick={() => setIsConfirmPasswordVisible(prev => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      isConfirmPasswordVisible
                        ? "Hide confirmation password"
                        : "Show confirmation password"
                    }
                  >
                    {isConfirmPasswordVisible ? (
                      <EyeOff className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Sign up
              </Button>
              {form.formState.errors && (
                <div className="text-red-500">
                  {Object.entries(form.formState.errors).map(([key, error]) => (
                    <p key={key}>{error.message}</p>
                  ))}
                </div>
              )}
            </form>
          </FormProvider>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

function CountriesDropdown() {
  const countries = Route.useLoaderData();
  const form = useFormContext<SignUpForm>();

  const sortedCountries = useMemo(() => {
    const uniqueNames = new Set(
      countries
        .map(country => country.name?.common?.trim())
        .filter((name): name is string => Boolean(name))
    );

    return Array.from(uniqueNames).sort((a, b) =>
      a.localeCompare(b, "en", { sensitivity: "base" })
    );
  }, [countries]);

  const hasCountries = sortedCountries.length > 0;

  return (
    <Select       {...form.register("country")}
      onValueChange={value => form.setValue("country", value)} disabled={!hasCountries}>
      <SelectTrigger
        id="country"
        className="w-full pl-10 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <SelectValue
          placeholder={
            hasCountries ? "Select your country" : "Countries unavailable"
          }
        />
      </SelectTrigger>
      {hasCountries ? (
        <SelectContent className="max-h-[300px]" position="popper">
          {sortedCountries.map(country => (
            <SelectItem key={country} value={country}>
              {country}
            </SelectItem>
          ))}
        </SelectContent>
      ) : null}
    </Select>
  );
}
