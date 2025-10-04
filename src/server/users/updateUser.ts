import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminMiddleware } from "../auth-middleware";
import { users } from "@/lib/db/schema/auth";
import { db } from "@/lib/db/connection";
import { and, eq } from "drizzle-orm";

export const updateUser = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      name: z.string().optional(),
      email: z.string().optional(),
      role: z.string().optional(),
      managerId: z.string().optional(),
    })
  )
  .middleware([adminMiddleware])
  .handler(async ({ data, context }) => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, context.session.userId));

    if (!user || !user.companyId) {
      throw new Error("User or company not found");
    }

    const { id, name, email, role, managerId } = data;

    await db
      .update(users)
      .set({ name, email, role, managerId })
      .where(and(eq(users.id, id), eq(users.companyId, user.companyId)));
  });
