import { createServerFn } from "@tanstack/react-start";
import z from "zod";

export const getCountryNames = createServerFn({ method: "GET" }).handler(
  async () => {
    const res = await fetch("https://restcountries.com/v3.1/all?fields=name");
    const data = await res.json();
    return data as Country[];
  }
);

export const getCurrencyByCountryName = createServerFn({ method: "GET" })
  .inputValidator(z.object({ name: z.string().min(1) }))
  .handler(async ({ data: { name } }) => {
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`
    );
    const data = await res.json();
    if (!data[0]) {
      throw new Error("Country not found");
    }
    return data[0] as CountryCurrency;
  });

export interface Country {
  name: {
    common: string;
    official: string;
    nativeName: Record<
      string,
      {
        official: string;
        common: string;
      }
    >;
  };
}

export interface CountryCurrency {
  currencies: Record<
    string,
    {
      name: string;
      symbol: string;
    }
  >;
}
