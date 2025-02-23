import type { ProxmoxStorageFormat } from "~/types";
import { proxmoxApiCall } from "../proxmoxApiCall";



export function proxmoxStorageApi(
    host: string,
    key: string
) {
    const api = proxmoxApiCall(host, key);

    return {
        getStorage(
            type?: ProxmoxStorageFormat
        ) {
            return api<[{type?: ProxmoxStorageFormat}, {data: string[]}]>(
                "GET",
                "getStorage",
                "storage",
                {
                    qp: { type }
                }
            )
        }
    }
}
