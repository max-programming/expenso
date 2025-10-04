import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { adminMiddleware } from "../auth-middleware";
import { users } from "@/lib/db/schema/auth";
import { db } from "@/lib/db/connection";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { nanoid } from "nanoid";

export const addUser = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email"),
      role: z.enum(["manager", "employee"]),
      managerId: z.string().optional(),
    })
  )
  .middleware([adminMiddleware])
  .handler(async ({ data, context }) => {
    const { name, email, role, managerId } = data;

    const [user] = await db
      .select({
        companyId: users.companyId,
      })
      .from(users)
      .where(eq(users.id, context.session.userId));

    if (!user || !user.companyId) {
      throw new Error("User or company not found");
    }

    const defaultPassword = nanoid();
    const res = await auth.api.createUser({
      body: {
        email: email,
        password: defaultPassword,
        name: name,
        role: role,
      },
    });

    await db
      .update(users)
      .set({
        companyId: user.companyId,
        managerId: managerId,
      })
      .where(eq(users.id, res.user.id));

    return {
      success: true,
      defaultPassword,
    };
  });
