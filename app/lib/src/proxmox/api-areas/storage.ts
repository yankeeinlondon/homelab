import type { ProxmoxStorageFormat } from "~/types";
import { proxmoxApiCall } from "~/utils";


export function proxmoxStorageApi(
    host: string,
    key: string
) {
    const api = proxmoxApiCall(host, key);

    return {
        getStorage(
            type?: ProxmoxStorageFormat
        ) {
            return api<[{type?: ProxmoxStorageFormat}, string[]]>(
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
