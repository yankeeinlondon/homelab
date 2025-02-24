import type { 
    ProxmoxExpectedService, 
    ProxmoxLxc, 
    ProxmoxNetwork, 
    ProxmoxQemu, 
    ProxmoxReplicationJob, 
    ProxmoxService, 
    ProxmoxStorage, 
    ProxmoxStorageFormat, 
    ProxmoxTask 
} from "~/types";
import { proxmoxApiCall } from "../proxmoxApiCall";
import { isError } from "~/type-guards";
import type { Suggest } from "inferred-types";

export function proxmoxNodesAptApi(
    host: string,
    key: string,
    node: string
) {
    const api = proxmoxApiCall(host, key);

    return {
        getApt() {
            return api(
                "GET",
                "getApt",
                `nodes/${node}/apt`
            )
        },

        getAvailablePkgUpdates(node: string) {
            return api(
                "GET",
                "getAvailablePkgUpdates",
                `nodes/${node}/apt/update`
            )
        },

        getAptPackagesInstalled(node: string) {
            return api(
                "GET",
                "getAptPackagesInstalled",
                `nodes/${node}/apt/repositories`
            )
        },

        /**
         * Get package information for important Proxmox packages.
         */
        getPackageVersions(node: string) {
            return api(
                "GET",
                "getPackageVersions",
                `nodes/${node}/apt/versions`
            )
        },

        /**
         * Runs an `apt update` on the given Proxmox node
         */
        updatePackages(node: string) {
            return api(
                "POST",
                "getAptPackagesInstalled",
                `nodes/${node}/apt/update`
            )
        },
        
    }
} // end APT

export function proxmoxNodesCapabilitiesApi(
    host: string,
    key: string,
    node: string
) {
    const api = proxmoxApiCall(host, key);

} // end Capabilities

export function proxmoxNodesCephApi(
    host: string,
    key: string,
    node: string
) {
    const api = proxmoxApiCall(host, key);

} // end Ceph

export function proxmoxNodesCertificatesApi(
    host: string,
    key: string,
    node: string
) {
    const api = proxmoxApiCall(host, key);

} // end Certificates

export function proxmoxNodesDisksApi(
    host: string,
    key: string,
    node: string
) {
    const api = proxmoxApiCall(host, key);

} // end Disks

export function proxmoxNodesFirewallApi(
    host: string,
    key: string,
    node: string
) {
    const api = proxmoxApiCall(host, key);

} // end Firewall


export function proxmoxNodesHardwareApi(
    host: string,
    key: string,
    node: string
) {
    const api = proxmoxApiCall(host, key);

} // end Hardware

export function proxmoxNodesLxcApi(
    host: string,
    key: string,
    node: string
) {
    const api = proxmoxApiCall(host, key);

    return {
        /**
         * @deprecated not implemented!
         */
        getAll() {
            return api<[never, {data: ProxmoxLxc[]}]>(
                "GET",
                "lxc/getAll",
                `nodes/${node}/lxc`
            )
        }
    }

} // end Lxc


export function proxmoxNodesNetworkApi(
    host: string,
    key: string,
    node: string
) {
    const api = proxmoxApiCall(host, key);

    return {
        /**
         * Get's all networks available to the given PVE node
         */
        getAll() {
            return api<[never, {data: ProxmoxNetwork[]}]>(
                "GET",
                "network/getAll",
                `nodes/${node}/network`
            )
        }
    }

} // end Network

export function proxmoxNodesQemuApi(
    host: string,
    key: string,
    node: string
) {
    const api = proxmoxApiCall(host, key);

    return {
        getAll() {
            return api<[never, {data: ProxmoxQemu[]}]>(
                "GET",
                "qemu/getAll",
                `nodes/${node}/qemu`
            )
        } 
    }

} // ends Qemu

export function proxmoxNodesReplicationApi(
    host: string,
    key: string,
    node: string
) {
    const api = proxmoxApiCall(host, key);

    return {
        status(vmid?: number) {
            const id = vmid ? `/${vmid}` : "";
            return api<[never, {data: ProxmoxReplicationJob[]}]>(
                "GET",
                `replication/status${id}`,
                `nodes/${node}/replication${id}`
            )
        }
    }

} // end Replication

export function proxmoxNodesScanApi(
    host: string,
    key: string,
    node: string
) {
    const api = proxmoxApiCall(host, key);

    return {
        async getAvailableMethods() {
            return api<[never, {data: { method: ProxmoxStorageFormat}[]}]>(
                "GET",
                `scan/getAvailable`,
                `nodes/${node}/scan`
            ).then(resp => isError(resp) ? resp : resp.data.map(i => i.method))
        },
        async scanWithMethod(method: ProxmoxStorageFormat) {
            return api<[never, {data: { method: ProxmoxStorageFormat}[]}]>(
                "GET",
                `scan/scanWithMethod`,
                `nodes/${node}/scan/${method}`
            )
        },

    }
} // end Scan

export function proxmoxNodesSdnApi(
    host: string,
    key: string,
    node: string
) {
    const api = proxmoxApiCall(host, key);

    return {
        async getZones() {
            return api<[never, {data: {name: string}[]}]>(
                "GET",
                "sdn/getZones",
                `nodes/${node}/sdn/zones`
            ).then(r => isError(r) ? r : r.data.map(i => i.name))
        },
        async getZoneContent(zone: string) {
            return api<[never, {data: unknown}]>(
                "GET",
                "sdn/getZonesContent",
                `nodes/${node}/sdn/zones/${zone}/content`
            )
        }
    }

} // end Sdn

export function proxmoxNodesServicesApi(
    host: string,
    key: string,
    node: string
) {
    const api = proxmoxApiCall(host, key);

    return {
        async getServiceList<S extends Suggest<ProxmoxExpectedService>>(
            service?: S
        ) {
            return api<[never, {data: S extends string ? ProxmoxService : ProxmoxService[]}]>(
                "GET",
                "services/getServiceList",
                service ? `nodes/${node}/services/${service}/state` : `nodes/${node}/services`
            )
        },

        /** 
         * Hard restart service. Use reload if you want to reduce interruptions. 
         */
        async restartService(
            service: Suggest<ProxmoxExpectedService>
        ) {
            return api<[never, string]>(
                "POST",
                "services/restartService",
                `nodes/${node}/services/${service}/restart`
            )
        },
        /** 
         * Reload service. Falls back to restart if service cannot be reloaded.
         */
        async reloadService(
            service: Suggest<ProxmoxExpectedService>
        ) {
            return api<[never, string]>(
                "POST",
                "services/reloadService",
                `nodes/${node}/services/${service}/reload`
            )
        },

        /** 
         * Start Service
         */
        async startService(
            service: Suggest<ProxmoxExpectedService>
        ) {
            return api<[never, string]>(
                "POST",
                "services/startService",
                `nodes/${node}/services/${service}/start`
            )
        },
        /** 
         * Stop Service
         */
        async stopService(
            service: Suggest<ProxmoxExpectedService>
        ) {
            return api<[never, string]>(
                "POST",
                "services/stopService",
                `nodes/${node}/services/${service}/stop`
            )
        },
    }
} // end Services

export function proxmoxNodesStorageApi(
    host: string,
    key: string,
    node: string
) {
    const api = proxmoxApiCall(host, key);

    return {
        async getStorage<T extends string>(
            storageId?: T
        ) {
            return api<[never, {data: T extends string ? ProxmoxStorage[] : ProxmoxStorage}]>(
                "GET",
                "storage/getStorage",
                storageId 
                    ? `nodes/${node}/storage/${storageId}/status` 
                    : `nodes/${node}/storage`
            )
        },

        // TODO: the docs leave this interface a bit unclear
        // specifiically it's not clear how the "type" and "filename"
        // should be passed to endpoint
        async upload(
            _type: "iso" | "vztmpl" | "import",
            _filename: string,
            storageId: string
        ) {
            return api<[never, string]>(
                "POST",
                "storage/getStorage",
                `nodes/${node}/storage/${storageId}/upload`
            )
        }
    }

} // end Storage

export function proxmoxNodesTasksApi(
    host: string,
    key: string,
    node: string
) {
    const api = proxmoxApiCall(host, key);

    return {
        async getTasks() {
            return api<[never, {data: ProxmoxTask[]}]>(
                "GET",
                "tasks/getTasks",
                `nodes/${node}/tasks`
            )
        }
    }
} // end Tasks

export function proxmoxNodesVzDumpApi(
    host: string,
    key: string,
    node: string
) {
    const api = proxmoxApiCall(host, key);

} // end VzDump



// NOTE: these appear NOT to be implemented!
function BaseApi(
    host: string,
    key: string,
    node: string
) {
    const api = proxmoxApiCall(host, key);

    return {
        /**
         * @deprecated not implemented but in spec
         */
        getNodeStatus() {
            return api<[never, {data: unknown}]>(
                "GET",
                "getNodeStatus",
                `nodes/${node}/status`
            )
        },

        getNodeReport() {
            return api<[never, {data: unknown}]>(
                "GET",
                "getNodeHosts",
                `nodes/${node}/hosts`
            )
        }
    }
} // end VzDump


export function proxmoxNodesApi(
    host: string,
    key: string
) {
    return (node: string) => {
        node = node;

        return {
            // ...BaseApi(host,key), 
            apt: proxmoxNodesAptApi(host,key,node),
            capabilities: proxmoxNodesCapabilitiesApi(host,key,node),
            ceph: proxmoxNodesCephApi(host,key,node),
            certificates: proxmoxNodesCertificatesApi(host,key,node),
            disks: proxmoxNodesDisksApi(host,key,node),
            firewall: proxmoxNodesFirewallApi(host,key,node),
            hardware: proxmoxNodesHardwareApi(host,key,node),
            lxc: proxmoxNodesLxcApi(host,key,node),
            network: proxmoxNodesNetworkApi(host,key,node),
            qemu: proxmoxNodesQemuApi(host,key,node),
            replication: proxmoxNodesReplicationApi(host,key,node),
            scan: proxmoxNodesScanApi(host,key,node),
            sdn: proxmoxNodesSdnApi(host,key,node),
            services: proxmoxNodesServicesApi(host,key,node),
            storage: proxmoxNodesStorageApi(host,key,node),
            tasks: proxmoxNodesTasksApi(host,key,node),
            vzDump: proxmoxNodesVzDumpApi(host,key,node),
        }
    }
}
