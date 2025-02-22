

export type InventoryItem = {
    dns: string,
    ip: string,
    tailnet: boolean,
    locale: "venice" | "london"
}

export type Inventory = {
    data: InventoryItem[]
}


export type HttpVerb = "GET" | "PUT" | "POST" | "PATCH" | "DELETE" | "HEAD";

export type AllowBlock = "allow" | "block"
