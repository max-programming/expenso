import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { adminMiddleware } from "../auth-middleware";
import { db } from "@/lib/db/connection";
import { users } from "@/lib/db/schema/auth";
import { and, eq } from "drizzle-orm";

export const deleteUser = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .middleware([adminMiddleware])
  .handler(async ({ data, context }) => {
    const [user] = await db
      .select({ companyId: users.companyId })
      .from(users)
      .where(eq(users.id, context.session.userId));

    if (!user || !user.companyId) {
      throw new Error("User or company not found");
    }

    const { id } = data;

    await db
      .delete(users)
      .where(and(eq(users.id, id), eq(users.companyId, user.companyId)));
  });
