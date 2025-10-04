import { type CompanyId, companyIdHelper } from "@/lib/id";
import { pgTable } from "drizzle-orm/pg-core";

export const companies = pgTable("companies", (t) => ({
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => companyIdHelper.generate())
    .$type<CompanyId>(),
  name: t.text().notNull(),
  currency: t.varchar({ length: 3 }).notNull(),
  createdAt: t.timestamp().notNull().defaultNow(),
}));
