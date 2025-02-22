import type { Inventory } from "~/types"

const INV =  Bun.file(`./inventory.json`, { type: "application/json" });

if(await INV.exists()) {
    const {data} = await INV.json() as Inventory;

    for (const el of data) {
        let {dns, ip, tailnet, locale} = el;
        

    }

}
