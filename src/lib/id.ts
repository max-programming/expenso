import { IdHelper, type InferId } from "typed-id";

export const companyIdHelper = new IdHelper("cmp");

export type CompanyId = InferId<typeof companyIdHelper>;
