import { createServerFn } from "@tanstack/react-start";

export const getCountriesAndCurrencies = createServerFn({ method: "GET" })
  .handler(async () => {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,currencies"
    );
    const data = await res.json();
    return data as Country[];
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
  currencies: Record<
    string,
    {
      name: string;
      symbol: string;
    }
  >;
}
