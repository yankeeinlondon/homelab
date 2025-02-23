import type { ProxmoxCephStatus, ProxmoxClusterNode, ProxmoxClusterNodeConfig, ProxmoxClusterNodeType, ProxmoxClusterResources, ProxmoxStorageFormat } from "~/types";
import { proxmoxApiCall } from "../proxmoxApiCall";

export type ProxmoxClusterStatus = {

}


export function proxmoxClusterApi(
    host: string,
    key: string
) {
    const api = proxmoxApiCall(host, key);

    return {
        getClusterStatus() {
            return api<[never, {data: ProxmoxClusterNode<ProxmoxClusterNodeType>[]}]>(
                "GET",
                "getClusterStatus",
                "cluster/status"
            )
        },
        getClusterResources() {
            return api<[never, {data: ProxmoxClusterResources}] >(
                "GET",
                "getClusterResources",
                "cluster/resources"
            )
        },
        /** 
         * Get next free VMID. Pass a VMID to assert that its free (at time of
         * check).
         */
        nextId() {
            return api<[never, {data: number}] >(
                "GET",
                "nextId",
                "cluster/nextid"
            )
        },
        /**
         * Read cluster log
         */
        getClusterLog() {
            return api<[never, {data: unknown[]}] >(
                "GET",
                "getClusterLog",
                "cluster/log"
            )
        },

        getSdnVnets() {
            return api<[never, {data: unknown[]}] >(
                "GET",
                "getSdnVnets",
                "cluster/sdn/vnets"
            )
        },

        getSdnControllers() {
            return api<[never, {data: unknown[]}] >(
                "GET",
                "getSdnControllers",
                "cluster/sdn/controllers"
            )
        },

        getSdnDns() {
            return api<[never, {data: unknown[]}] >(
                "GET",
                "getSdnDns",
                "cluster/sdn/dns"
            )
        },

        getSdnIpams() {
            return api<[never, {data: unknown[]}] >(
                "GET",
                "getSdnIpams",
                "cluster/sdn/ipams"
            )
        },

        getSdnZones() {
            return api<[never, {data: unknown[]}] >(
                "GET",
                "getSdnZones",
                "cluster/sdn/zones"
            )
        },

        getReplicationJobs() {
            return api<[never, {data: unknown[]}] >(
                "GET",
                "getReplicationJobs",
                "cluster/replication"
            )
        },

        getClusterNotifications() {
            return api<[never, {data: unknown[]}] >(
                "GET",
                "getClusterNotifications",
                "cluster/notifications"
            )
        },

        getClusterMetrics() {
            return api<[never, {data: unknown[]}] >(
                "GET",
                "getClusterMetrics",
                "cluster/metrics"
            )
        },

        getClusterMapping() {
            return api<[never, {data: unknown[]}] >(
                "GET",
                "getClusterMapping",
                "cluster/mapping"
            )
        },

        getClusterJobs() {
            return api<[never, {data: unknown[]}] >(
                "GET",
                "getClusterJobs",
                "cluster/jobs"
            )
        },

        /**
         * Get HA manager status.
         */
        getClusterHaStatusCurrent() {
            return api<[never, {data: unknown[]}] >(
                "GET",
                "getClusterHaStatusCurrent",
                "cluster/ha/status/current"
            )
        },

        /**
         * Get full HA manager status, including LRM status.
         */
        getClusterHaManagerStatus() {
            return api<[never, {data: unknown[]}] >(
                "GET",
                "getClusterHaManagerStatus",
                "cluster/ha/status/manager_status"
            )
        },

        getClusterFirewall() {
            return api<[never, {data: unknown[]}] >(
                "GET",
                "getClusterFirewall",
                "cluster/firewall"
            )
        },

        getClusterNodeConfig() {
            return api<[never, {data: ProxmoxClusterNodeConfig[]}] >(
                "GET",
                "getClusterNodeConfig",
                "cluster/config/nodes"
            )
        },

        getClusterCephStatus() {
            return api<[never, {data: ProxmoxCephStatus}] >(
                "GET",
                "getClusterCephStatus",
                "cluster/ceph/status"
            )
        },

        getClusterBackup() {
            return api<[never, {data: unknown[]}] >(
                "GET",
                "getClusterBackup",
                "cluster/backup"
            )
        },

        getClusterAcmeMeta() {
            return api<[never, {data: unknown[]}] >(
                "GET",
                "getClusterAcmeMeta",
                "cluster/acme/meta"
            )
        },
    }
}
