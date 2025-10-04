import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { auth } from "@/lib/auth";

export const signInUser = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
    })
  )
  .handler(async ({ data }) => {
    const { email, password } = data;

    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return response;
  });
