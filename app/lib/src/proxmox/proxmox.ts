import { proxmoxAccessApi } from "./api-areas/access";
import { proxmoxClusterApi } from "./api-areas/cluster";
import { proxmoxNodesApi } from "./api-areas/nodes";
import { proxmoxPoolsApi } from "./api-areas/pools";
import { proxmoxStorageApi } from "./api-areas/storage"

/**
 * Get a full type-aware API surface to a Proxmox Host
 */
export function Proxmox(host: string, key: string ) {
    const access = proxmoxAccessApi(host,key);
    const cluster = proxmoxClusterApi(host,key);
    const nodes = proxmoxNodesApi(host,key);
    const pools = proxmoxPoolsApi(host,key);
    const storage = proxmoxStorageApi(host,key);

    return {
        access,
        cluster,
        nodes,
        pools,
        storage
    }
}
