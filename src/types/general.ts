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
