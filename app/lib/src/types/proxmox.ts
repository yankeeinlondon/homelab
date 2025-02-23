import type { DateTime, Ip4Address, Ip4Netmask, Ip6Address, NumberLike, Suggest } from "inferred-types";
import type { Delimited } from "./general";

export type ProxmoxStorageFormat =
| "btrfs"
| "cephfs"
| "dir"
| "esxi"
| "glusterfs"
| "iscsi"
| "iscsidirect"
| "lvm"
| "lvmthin"
| "nfs"
| "pbs"
| "zfs"
| "cifs"
| "zfspool";

export type ProxmoxClusterNodeType = "cluster" | "node";

export type ProxmoxClusterNode<T extends ProxmoxClusterNodeType> = {
    
    id: T extends "cluster" ? "cluster" : `node/${string}`;
    /** 
     * Indicates the type, either cluster or node. The type defines the object 
     * properties e.g. quorate available for type cluster. 
     */
    type: T;
    name: string;
    /** Indicates if there is a majority of nodes online to make decisions */
    quorate: T extends "cluster"
        ? 0 | 1
        : never;
    version: T extends "cluster" 
        ? number
        : never;
    /** Nodes count, including offline nodes. */
    nodes: T extends "cluster" 
        ? number
        : never;
    /** ID of the node from the corosync configuration. */
    nodeid: T extends "cluster"
        ? never
        : number;
    /** Indicates if the node is online or offline. */
    online: T extends "cluster"
        ? never
        : 1 | 0;
    /**
     * Indicates if this is the responding node.
     */
    local: T extends "cluster"
        ? never
        : number;         
    /** IP of the resolved nodename. */
    ip: T extends "cluster"
        ? never
        : Ip4Address | Ip6Address;      
    /** 
     * Proxmox VE Subscription level, indicates if eligible for enterprise 
     * support as well as access to the stable Proxmox VE Enterprise Repository. */  
    level: T extends "cluster"
        ? never
        : string;         

}

export type ProxmoxClusterResources = {
    id: string;
    status: Suggest<"ok" | "available" | "unknown">;
    type: Suggest<"sdn" | "storage" | "node">;
    node?: string;
    content?: string;
    plugintype?: Suggest<"zfspool" | "pbs">;
    maxdisk?: number;
    shared: 0 | 1;
    storage?: Suggest<"config" | "ceph-meta" | "homepage">;
    sdn?: Suggest<"localnetwork">
}

export type ProxmoxClusterNodeConfig = {
    nodeid: string;
    ring0_addr: Ip4Address | Ip6Address;
    node: string;
    quorum_votes: NumberLike;
    name: string;
}


export type ProxmoxCephStatus = {
    health: {
        mutes: unknown[];
        checks: Object[];
        status: Suggest<"HEALTH_WARN">;
    }
    progress_events: Record<string, unknown>;
    fsid: string;
    monmap: {
        created: DateTime;
        epoch: number;
        stretch_mode: boolean;
        modified: DateTime;
        fsid: string;
        election_strategy: number;
        min_mon_release_name: string;
        mons: unknown[];
        quorum: [number, number];
        min_mon_release: number;
        tiebreak_mon: string;
        features: Object[];
    }
    osdmap: {
        num_osds: number;
        num_in_osds: number;
        osd_in_since: number;
        num_remapped_pages: number;
        osd_up_since: number;
        epoch: number;
        num_up_osds: number;
    }
    quorum_names: string[];
    pgmap: {
        read_op_per_sec: number,
        num_pgs: number,
        data_bytes: number,
        num_pools: number,
        write_op_per_sec: number,
        bytes_total: number,
        bytes_avail: number,
        write_bytes_sec: number,
        pgs_by_state: Object[];
        bytes_used: number;
        num_objects: number;
    }
    quorum: [number,number];
    quorum_age: number;
    mgrmap: Record<string, unknown>;
    servicemap: {
        services: Object[];
        modified: DateTime;
        epoch: number;
    }
    fsmap: {
        epoch: number;
        "up:standby": number;
        by_rank: unknown[];
    }
    election_epoch: number
}

export type ProxmoxNetworkMethod = 
| "manual"
| "static"
| "dhcp";

export type ProxmoxNetworkType =
| "vlan"
| "unknown"
| "bridge"
| "eth";

export type ProxmoxNetworkFamily = 
| "inet";

export type ProxmoxNetwork = {
    autostart?: 0 | 1 | null;
    active?: 0 | 1 | null;
    exists?: 0 | 1 | null;
    families: Suggest<ProxmoxNetworkFamily>[];
    priority: number;
    iface: string;
    method6: Suggest<ProxmoxNetworkMethod>;
    method: Suggest<ProxmoxNetworkMethod>;
    cidr?: Ip4Netmask;
    type?: Suggest<ProxmoxNetworkType>;
    mtu?: NumberLike;
    bridge_stp?: string;
    bridge_vids?: string;
    bridge_ports?: string;
    bridge_vlan_aware?: 0 | 1 | null;
    bridge_fd?: NumberLike;

    [key: string]: unknown;
}

export type ProxmoxRunStatus =
| "running"
| "stopped"
;

export type ProxmoxLxc = {
    vmid: number;
    name: string;
    tags: Delimited<";">;

    disk: number;
    maxmem: number;
    diskwrite: number;
    cpus: number;
    status: Suggest<ProxmoxRunStatus>;
    mem: number;
    uptime: number;
    netin: number;
    maxswap: number;
    swap: number;
    maxdisk: number;
    netout: number;
    pid: number;
    diskread: number;
    type: "lxc";
    cpu: number;

    [key: string]: unknown;
}

export type ProxmoxQemu = Omit<ProxmoxLxc, "type"> & {
    shares?: number;
    serial?: number;
    balloon_min?: number;
    /** when set to 1 this indicates it is a template */
    template?: 0 | 1;
    diskwrite: number;
}

export type ProxmoxVmType = "qemu" | "lxc";

export type ProxmoxReplicationTarget = "local" | "pbs";

export type ProxmoxReplicationJob = {
    /** 
     * the `id` which starts with the **vmid**
     */
    id: `${number}-${number}`;
    /** the node which is acting as the "source" for this job */
    source: string;
    /** the node which this job is targetting */
    target: string;

    /** 
     * a static user set comment for the job which helps to 
     * clarify the intention of the job.
     */
    comment: string;

    type: Suggest<ProxmoxReplicationTarget>;

    jobnum: number;
    duration: number;
    vmtype: ProxmoxVmType;
    schedule: string;
    last_sync: number;
    last_try: number;
    guest: number;

    fail_count?: number;
    error?: string;
}

export type ProxmoxServiceState =
| "dead"
| "running";

export type ProxmoxServiceUnitState =
| "not-found"
| "enabled"
| "enabled-runtime";

export type ProxmoxServiceActiveState =
| "active";


export type ProxmoxExpectedService =
| "chrony" 
| "corosync" 
| "cron" 
| "ksmtuned" 
| "postfix" 
| "pve-cluster" 
| "pve-firewall" 
| "pve-ha-crm" 
| "pve-ha-lrm" 
| "pvedaemon" 
| "pvefw-logger" 
| "pveproxy" 
| "pvescheduler" 
| "pvestatd" 
| "spiceproxy" 
| "sshd" 
| "syslog" 
| "systemd-journald" 
| "systemd-timesyncd";

export type ProxmoxService = {
    service: string;
    name: string;
    desc: string;
    state: Suggest<ProxmoxServiceState>;
    "unit-state": Suggest<ProxmoxServiceUnitState>;
    "active-state": Suggest<ProxmoxServiceActiveState>;

}

export type ProxmoxContentType = 
| "iso"
| "images"
| "backup"
| "snippets"
| "rootdir"
| "vztmpl";

export type ProxmoxStorage = {
    storage: string;
    active: 1 | 0 | null;
    content: Delimited<",", ProxmoxContentType>;
    shared: 1 | 0 | null;

    type: ProxmoxStorageFormat;
    
    avail: number;
    used: number;
    used_fraction: number;
    total: number;
}

export type ProxmoxTask<
    TNode extends string = string,
    TUser extends `${Suggest<"root">}@${Suggest<"pam">}` = `${Suggest<"root">}@${Suggest<"pam">}`,
    TType extends string = string,
    TId extends `${NumberLike}@${Suggest<"local">}` = `${NumberLike}@${Suggest<"local">}`
> = {
    id: TId;
    user: TUser;
    node: TNode;
    status: Suggest<"OK">;

    upid: `UPID:${TNode}:${string}:${TType}:${TId}:${TUser}`;

    starttime: number;
    endtime: number;
    pstart: number;
    type: TType;
    pid: number;
}
