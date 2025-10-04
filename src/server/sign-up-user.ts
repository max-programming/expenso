import { auth } from "@/lib/auth";
import { db } from "@/lib/db/connection";
import { companies } from "@/lib/db/schema/companies";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getCurrencyByCountryName } from "./get-countries-and-currencies";
import { users } from "@/lib/db/schema/auth";
import { eq } from "drizzle-orm";

export const signUpUser = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(8),
      country: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const country = await getCurrencyByCountryName({
      data: { name: data.country },
    });

    const currency = Object.keys(country.currencies ?? {})[0];

    if (!currency) {
      throw new Error("Could not find currency for country");
    }

    // sign up the user
    const response = await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });

    // create the company for the user
    const [company] = await db
      .insert(companies)
      .values({ name: `${data.name}'s Company`, currency })
      .returning({ id: companies.id });

    // update the user with the company id and set it to admin
    await db
      .update(users)
      .set({ companyId: company.id, role: "admin" })
      .where(eq(users.id, response.user.id));

    // sign in the user
    await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    });

    return {
      success: true,
    };
  });
