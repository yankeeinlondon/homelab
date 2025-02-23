import { proxmoxApiCall } from "../proxmoxApiCall";



export function proxmoxPoolsApi(
    host: string,
    key: string
) {
    const api = proxmoxApiCall(host, key);

    return {
        
    }

}
