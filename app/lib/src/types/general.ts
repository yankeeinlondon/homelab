import type { IsNever } from "inferred-types";

export interface InventoryItem {
  dns: string;
  ip: string;
  tailnet: boolean;
  locale: "venice" | "london";
}

export interface Inventory {
  data: InventoryItem[];
}

export type HttpVerb = "GET" | "PUT" | "POST" | "PATCH" | "DELETE" | "HEAD";

export type AllowBlock = "allow" | "block";


export type Delimited<
    T extends string,
    U = never
> = string & {
    brand: "Delimited";
    delimter: T;
} & IsNever<U> extends true
? {}
: { elements: U }

export type HttpStatusCode = number;
