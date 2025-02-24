import type { 
    Email, 
    Ip4Address, 
    Ip6Address, 
    Iso3166_1_CountryCode,  
    Iso8601DateTime, 
    NumberLike, 
    SemanticVersion, 
    Suggest 
} from "inferred-types"
import type { HttpStatusCode } from "./general";
import type { Domain } from "dist";

export type UnifiChannel = Suggest<"release" | "beta" | "release-candidate">;

export type UnifiApp = {
    controllerStatus: Suggest<"READY">;
    name: Suggest<"users">;
    port: number;
    swaiVersion: number;
    type: "app",
    uiVersion: string;
    version: string;
}

export type UnifiHostState = {
    anonid: string;
    apps: UnifiApp[];
    autoUpdate: {
        includeApplications: boolean;
        perferencesPrompt: null | unknown;
        schedule: null | unknown;
    }
    availableChannels: UnifiChannel[];
    consolesOnSameLocation: string[];
    controller_uuid: string;
    controllers: UnifiController[];
    country: Iso3166_1_CountryCode;
    deviceErrorCode: null | unknown;
    deviceState: "updateAvaiable";
    deviceStateLastChanged: number;
    directConnectionDOmain: Domain;
    features: {
        cloud: {
            applicationEvents: boolean;
            applicationEventsHttp: boolean;
        },
        cloudBackup: boolean;
        deviceList: {
            autolinkDevices: boolean;
            partialUpdates: boolean;
            ucp4Events: boolean;
        }
        directRemoteConnection: boolean;
        hasGateway: boolean;
        hasLCM: boolean;
        hasLED: boolean;
        infoApis: {
            firmwareUppdate: boolean;
        }
        isAutomaticFailoverAvailable: boolean;
        mfa: boolean;
        notifications: boolean;
        sharedTokens: boolean;
        supportForm: boolean;
        teleport: boolean;
        teleportState: Suggest<"ENABLED">;
        uidService: boolean;
    }
    firmwareUpdate: {
        latestAvailableVersion: `${number}.${number}.${number}${string}`
    }
    hardware: {
        bom: string;
        "cpu.id": string;
        debianCodename: Suggest<"bullseye" | "bookworm" | "forky">;
        firmwareVersion: SemanticVersion<false>;
        hwrev: number;
        isUbios: boolean;
        mac: string;
        name: string;
        qrid: string;
        reboot: `${number}`
        serialno: string;
        shortname: string;
        subtype: string;
        sysid: number;
        upgrade: `${number}`;
        uid: string;
    }
    host_type: number;
    hostname: string;
    internetIssues5min: {
        periods: {index: number}[];
    }
    ip: Ip4Address | Ip6Address;
    ipAddres: (Ip4Address | Ip6Address)[];
    isStacked: boolean;
    isUbiosMigration: boolean;
    location: {
        lat: number;
        long: number;
        radius: number;
        text: string;
    }
    mac: string;
    mgmt_port: number;
    name: string;
    releaseChannel: UnifiChannel;
    state: Suggest<"connect">;
    timezone: `${string}/${string}`;
    ucareState: null | unknown;
    uidb: {
        guid: string;
        id: string;
        images: {
            default: string;
            "mobile-connection": string;
            "mobile-internet-connected": string;
            "mobile-no-internet": string;
            nopadding: string;
            topology: string;
        }
    }
    unadoptedUnifiOSDevices: unknown[];
    version: SemanticVersion<false>;
}


export type UnifiController = Suggest<
    "network" | "protect" | "access" | "talk" | "connect" | "innerspace"
>;

export type UnifiApplication = Suggest<
    "access" | "apollo" | "connect" | "innerspace" | "network" | "talk"
>

export type UnifiRole = Suggest<"admin" | "owner">;
export type UnifiPermission = Suggest<
    | "innerspace.management"
    | "network.management"
    | "system.management.location"
    | "system.management.user"
>

export type UnifiGroupMember = {
    mac: string;
    role: Suggest<"UNADOPTED">;
    roleAttributes: {
        applications: Record<
            UnifiApplication, 
            { owned: boolean; required: boolean; supported: boolean }
        >;
        candidateRoles: Suggest<"PRIMARY">[];
        connectedState: Suggest<"CONNECTED">;
        connectedStateLastChanged: Iso8601DateTime;
    };
    sysId: number;
}

export type UnifiHost = {
    hardwareId: string;
    id: string;
    ipAddress: Ip4Address | Ip6Address;
    isBlocked: boolean;
    lastConnectionStateChange: Iso8601DateTime;
    lastBackupTime: Iso8601DateTime;
    owner: boolean;
    registrationTime: Iso8601DateTime;
    reportedState: UnifiHostState;
    type: Suggest<"console">;
    userData: {
        apps: Suggest<"users" | "uid-agent">[];
        consoleGroupMembers: UnifiGroupMember[];
        controllers: UnifiController[];
        email: Email;
        features: {
            deviceGroups: boolean;
            floorplan: {
                canEdit: boolean;
                canView: boolean;
            }
            manageApplications: boolean;
            notifications: boolean;
            pion: boolean;
            webrtc: {
                iceRestart: boolean;
                mediaStreams: boolean;
                twoWayAudio: boolean;
            }
        }
        fullName: string;
        localId: string;
        permissions: Record<UnifiPermission, UnifiRole[]>;
        role: UnifiRole;
        roleId: string;
        status: Suggest<"ACTIVE">;
    }
}

export type UnifiDevice = {
    adoptionTime: Iso8601DateTime;
    firmwareStatus: Suggest<"upToDate">;
    id: string;
    ip: Ip4Address | Ip6Address;
    isConsole: boolean;
    isManaged: boolean;
    mac: string;
    model: string;
    name: string;
    note: null | string;
    productLine: Suggest<UnifiApplication>;
    shortname: string;
    startupTime: Iso8601DateTime;
    status: Suggest<"online" | "offline">;
    uidb: {
        guid: string;
        iconId: string;
        id: string;
        images: {
            default: string;
            nopadding: string;
            topology: string;
        }
    }
    updateAvailable: null | unknown;
    version: SemanticVersion<false>;
}



export type UnifiListHostReq = {
    /**
     * number of hosts to return
     */
    pageSize?: NumberLike;
    /**
     * Token for Pagination
     */
    nextToken?: string
}

export type UnifiListDeviceReq = {
    /**
     * filter down to a list of host IDs
     */
    hostIds?: string[];

    /**
     * Last processed timestamp of devices
     */
    time?: string;
    /**
     * number of hosts to return
     */
    pageSize?: NumberLike;
    /**
     * Token for Pagination
     */
    nextToken?: string
}



export type UnifiListHostResp = {
    data: UnifiHost[];
    httpStatusCode: HttpStatusCode;
    traceId: string;
}

export type UnifiListDeviceResp = {
    /**
     * provides network devices _by_ Unifi host
     */
    data: {
        devices: UnifiDevice[];
        hostId: string;
        hostName: string;
        updatedAt: Iso8601DateTime;
    }[];
    httpStatusCode: HttpStatusCode;
    traceId: string;
}
