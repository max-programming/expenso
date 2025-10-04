import {
  Link,
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
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
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInUser } from "@/server/sign-in-user";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/sign-in")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.session) {
      throw redirect({ to: "/" });
    }
  },
  head: () => ({
    meta: [
      {
        title: "Sign in",
      },
    ],
  }),
});

type SignInForm = z.infer<typeof signInForm>;
const signInForm = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function RouteComponent() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const signInMutation = useMutation({
    mutationFn: signInUser,
  });
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInForm),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: SignInForm) {
    signInMutation.mutate(
      {
        data: {
          email: data.email,
          password: data.password,
        },
      },
      {
        onSuccess() {
          navigate({ to: "/" });
        },
        onError(err) {
          form.setError("root", { message: err.message });
        },
      }
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl">Welcome back</CardTitle>
          <CardDescription className="text-base">
            Log in to pick up where you left off and keep your finances on
            track.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FormProvider {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Lock className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <Input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
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

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={signInMutation.isPending}
              >
                {signInMutation.isPending ? (
                  <>
                    <Spinner /> Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
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
            New here?{" "}
            <Link
              to="/sign-up"
              className="text-primary hover:underline font-medium"
            >
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
