import { proxmoxApiCall } from "~/utils"
import { proxmoxStorageApi } from "./api-areas/storage"
import type { Suggest } from "inferred-types"

/**
 * Get a full type-aware API surface to a Proxmox Host
 */
export function Proxmox(host: string, key: string ) {
    const storage = proxmoxStorageApi(host,key);


    return {
        storage
    }
}
