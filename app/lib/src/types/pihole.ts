import type { Dictionary, DnsName, Integer, Ip4Address, Suggest } from "inferred-types";

export interface PiholeAuthResponse__SUCCESS {
  session: {
    valid: true;
    totp: boolean;
    sid: string;
    csrf: string;
    validity: number;
    message: string;
  };
  took: number;
}

export interface PiholeAuthReponse__FAILURE {
  error: {
    key: string;
    message: string;
    hint: null | string;
  };
  took: number;
}

/**
 * the authorization response from the Pi-hole API
 */
export type PiholeAuthResp = PiholeAuthResponse__SUCCESS | PiholeAuthReponse__FAILURE;

/**
 * A **Pihole** Group
 */
export interface PiholeGroup {
  name: string;
  comment: string;
  enabled: boolean;
  id: number;
  date_added: number;
  date_modified: number;
}

export interface PiholeClients__History {
  active: number;
  total: number;
}

export interface PiholeGravity {
  domains_being_blocked: number;
  last_update: number;
}

export interface PiholeQueryCountsByTypes {
  /** A record: Maps a domain name to an IPv4 address */
  A: number;
  /** AAAA record: Maps a domain name to an IPv6 address */
  AAAA: number;
  /** ANY record: Requests all available records for a domain (deprecated in modern DNS) */
  ANY: number;
  /** SRV record: Specifies a service location, including hostname and port */
  SRV: number;
  /** SOA record: Contains administrative information about a domain, such as primary name server and serial number */
  SOA: number;
  /** PTR record: Used for reverse DNS lookups, mapping IP addresses to domain names */
  PTR: number;
  /** TXT record: Stores arbitrary text, commonly used for SPF, DKIM, and other verification records */
  TXT: number;
  /** NAPTR record: Used for URI-based services like VoIP and ENUM, allows regex-based rewriting of domain names */
  NAPTR: number;
  /** MX record: Specifies the mail servers responsible for receiving email for a domain */
  MX: number;
  /** DS record: Used in DNSSEC to store Delegation Signer (DS) records, linking child and parent zones */
  DS: number;
  /** RRSIG record: Contains cryptographic signatures for DNSSEC validation */
  RRSIG: number;
  /** DNSKEY record: Stores cryptographic keys used in DNSSEC for signing records */
  DNSKEY: number;
  /** NS record: Specifies the authoritative name servers for a domain */
  NS: number;
  /** SVCB record: Service binding record, used for service discovery and transport hints */
  SVCB: number;
  /** HTTPS record: A variant of SVCB designed specifically for HTTPS service discovery */
  HTTPS: number;
  /** OTHER: Represents an unknown or unsupported DNS query type */
  OTHER: number;
}

export interface PiholeQueryStatus {
  UNKNOWN: number;
  GRAVITY: number;
  FORWARDED: number;
  CACHE: number;
  REGEX: number;
  DENYLIST: number;
  EXTERNAL_BLOCKED_IP: number;
  EXTERNAL_BLOCKED_NULL: number;
  EXTERNAL_BLOCKED_NXRA: number;
  GRAVITY_CNAME: number;
  REGEX_CNAME: number;
  DENYLIST_CNAME: number;
  RETRIED: number;
  RETRIED_DNSSEC: number;
  IN_PROGRESS: number;
  DBBUSY: number;
  SPECIAL_DOMAIN: number;
  CACHE_STALE: number;
  EXTERNAL_BLOCKED_EDE15: number;
  [key: string]: number;
}

export interface PiholeQueryReplies {
  UNKNOWN: number;
  NODATA: number;
  NXDOMAIN: number;
  CNAME: number;
  IP: number;
  DOMAIN: number;
  RRNAME: number;
  SERVFAIL: number;
  REFUSED: number;
  NOTIMP: number;
  OTHER: number;
  DNSSEC: number;
  NONE: number;
  BLOB: number;
  [key: string]: number;
}

export interface PiholeQueries__History {
  total: number;
  blocked: number;
  percent_blocked: number;
  unique_domains: number;
  forwarded: number;
  frequency: number;
  types: PiholeQueryCountsByTypes;
  status: PiholeQueryStatus;
  replies: PiholeQueryReplies;
}

export interface PiholeQuery {
  id: Integer;
  time: number;
  type: PiholeQueryCountsByTypes;
  domain: Domain;
  cname: string | null;
  status: string | null;
  client: {
    ip: string;
    name: string | null;
  };
  dnssec: string | null;
  reply: {
    type: string | null;
    time: number;
  };
  list_id: Integer | null;
  upstream: string | null;
  ede: {
    code: Integer;
    text: string | null;
  };
}

/**
 * **PiHoleStatsSummary**
 *
 * Summary stats for a **Pihole** instance.
 */
export interface PiholeStatsSummary {
  queries: PiholeQueries__History;
  clients: PiholeClients__History;
  gravity: PiholeGravity;
  took: number;
}

export interface PiholeHistory {
  timestamp: number;
  total: number;
  cached: number;
  blocked: number;
  forwarded: number;
}

export type PiholeClientIdentity = Ip4Address | DnsName | "others";

export interface PiholeClientHistoryTimestamp {
  timestamp: number;
  data: Record<PiholeClientIdentity, number>;
}

export type PiholeClient__History = Record<
  PiholeClientIdentity,
  {
    name: string | null;
    total: number;
  }
>;

export interface PiholeTopClient {
  name: string;
  ip: string;
  count: number;
}

export interface PiholeUpstreamProvider {
  ip: string;
  name: string;
  count: number;
  statistics: {
    response: number;
    variance: number;
  };
}

export type PiholeBlockingStatus = "enabled" | "disabled";

export interface PiholeQueryOptions {
  from?: number;
  until?: number;
  /** Number of results to return */
  length?: number;
  /** Offset from first record */
  start?: number;
  /** Database ID of the most recent query to be shown */
  cursor?: number;
  /** Filter by specific domain (wildcards supported) */
  domain?: string;
  /** Filter by specific client IP address (wildcards supported) */
  client_ip?: string;
  /** Filter by specific client hostname (wildcards supported) */
  client_name?: string;
  /** Filter by specific upstream (wildcards supported) */
  upstream?: string;
  /** Filter by specific query type (A, AAAA, ...) */
  type?: Suggest<keyof PiholeQueryCountsByTypes>;
  status?: Suggest<keyof PiholeQueryStatus>;
  reply?: Suggest<keyof PiholeQueryReplies>;
  dnssec?: Suggest<"SECURE" | "INSECURE" | "BOGUS" | "ABANDONED" | "TRUNCATED">;
}

export type PiholeDomainType = "allow" | "deny";
export type PiholeDomainKind = "exact" | "regex";
export type Domain = DnsName;

export interface PiholeDomain {
  id: number;
  domain: DnsName;
  unicode: string;
  type: PiholeDomainType;
  kind: PiholeDomainKind;
  comment: string | null;
  enabled: boolean;
  date_added: number;
  date_modified: number;
  groups: number[];
}

export interface PiholeApiConfig<
  TReq = never,
  TQp extends Dictionary<string> = never,
> {
  body?: TReq;
  qp?: TQp;
}

/**
 * a configured client in the Pihole server
 */
export interface PiholeClient {
  id: Integer;
  client: string;
  comment: string | null;
  groups: Integer[];
  date_added: Integer;
  date_modified: Integer;
  name: string | null;
}

export type PiholeProcessingResult = null
    | { success: { item: string }[] }
    | { errors: { item: string; error: string }[] };

export type UnixTimestamp = number;

export interface PiholeDevice {
  id: Integer;
  hwaddr: string;
  interface: string;
  firstSeen: UnixTimestamp;
  lastQuery: UnixTimestamp;
  numQueries: Integer;
  macVendor: string | null;
  ips: {
    ip: string;
    name: string | null;
    lastSeen: UnixTimestamp;
    nameUpdated: UnixTimestamp;
  }[];
}

export interface PiholeRoute {
  table: number;
  family: PiholeAddressFamily;
  protocol: string;
  scope: string;
  type: string;
  flags: string[];
  iflags: number;
  gateway: Ip4Address;
  oif: string;
  dst: string;
}

export type PiholeGateway<D extends boolean = false> = {
  family: string;
  interface: string;
  address: string;
  local: string[];
} & D extends true
  ? {
      routes?: PiholeRoute[];
      interfaces?: {
        name: string;
        index: number;
        family: string;
        speed: string | null;
        type: string;
        flags: string[];
        ifname: string;
        txqlen: number;
        state: string;
        linkmode: number;
        mtu: number;
        min_mtu: number;
        max_mtu: number;
        group: number;
        promiscuity: number;
        unknown: number[];
        num_tx_queues: number;
        gso_max_segs: number;
        gso_max_size: number;
        num_rx_queues: number;
        carrier: boolean;
        qdisc: string;
        carrier_changes: number;
        carrier_up_count: number;
        carrier_down_count: number;
        proto_down: boolean;
        map: number;
        address: string;
        broadcast: string;
        stats: {
          rx_bytes: {
            value: number;
            unit: string;
          };
          tx_bytes: {
            value: number;
            unit: string;
          };
          bits: number;
          rx_packets: number;
          tx_packets: number;
          rx_errors: number;
          tx_errors: number;
          rx_dropped: number;
          tx_dropped: number;
          multicast: number;
          collisions: number;

        };
      };
      addresses: PiholeIpAddress[];
    }
  : {};

export type PiholeAddressFamily =
    | "inet"
    | "inet6"
    | "link"
    | "mpls"
    | "bridge"
    | "???";

export interface PiholeIpAddress {
  address: string;
  address_type: string;
  broadcast: string;
  broadcast_type: string;
  local: string;
  local_type: string;
  label: string;
  family: PiholeAddressFamily;
  flags: string[];
  prefixlen: Integer;
  scope: string;
  prefered: Integer;
  valid: Integer;
  cstamp: number;
  tstamp: number;
}

export interface PiholeInterface {
  name: string;
  speed: Integer | null;
  carrier: boolean;
  type: string;
  flags: string[];
  state: string;
  proto_down: boolean;
  address: string;
  broadcast: string;
  perm_address: string;
  stats: {
    rx_bytes: {
      value: number;
      unit: string;
    };
    tx_types: {
      value: number;
      unit: string;
    };
  };
  addresses: PiholeIpAddress[];
}

export interface PiholeDnsConfig {
  upstreams: string[];
  CNAMEdeepInspect: boolean;
  blockESNI: boolean;
  EDNS0ECS: boolean;
  ignoreLocalhost: boolean;
  showDNSSEC: boolean;
  analyzeOnlyAandAAAA: boolean;
  piholePTR: string;
  replyWhenBusy: string;
  blockTTL: Integer;
  hosts: string[];
  domainNeeded: boolean;
  expandHosts: boolean;
  domain: string;
  bogusPriv: boolean;
  dnssec: boolean;
  interface: string;
  hostRecord: string;
  listeningMode: string;
  queryLogging: boolean;
  cnameRecords: string[];
  port: Integer;
  cache: {
    size: Integer;
    optimizer: Integer;
    upstreamBlockedTTL: Integer;
  };
  revServers: string[];
  blocking: {
    active: boolean;
    mode: string;
    edns: string;
  };
  specialDomains: {
    mozillaCanary: boolean;
    iCloudPrivateRelay: boolean;
  };
  reply: {
    host: {
      force4: boolean;
      force6: boolean;
      IPv4: string;
      IPv6: string;
    };
    blocking: {
      force4: boolean;
      force6: boolean;
      IPv4: string;
      IPv6: string;
    };
  };
  rateLimit: {
    count: Integer;
    interval: Integer;
  };
}

export interface PiholeDhcpConfig {
  active: boolean;
  start: string;
  end: string;
  router: string;
  netmask: string;
  leaseTime: string;
  ipv6: boolean;
  rapidCommit: boolean;
  multiDNS: boolean;
  logging: boolean;
  ignoreUnknownClients: boolean;
  hosts: string[];
}

export interface PiholeConfig {
  dns: PiholeDnsConfig;
  dhcp: PiholeDhcpConfig;
  ntp: {
    ipv4: {
      active: boolean;
      address: string;
    };
    ipv6: {
      active: boolean;
      address: string;
    };
    sync: {
      active: boolean;
      server: string;
      interval: Integer;
      count: Integer;
      rtc: {
        set: boolean;
        device: string;
        utc: boolean;
      };
    };
  };
  resolver: {
    resolveIpv4: boolean;
    resolveIpv6: boolean;
    networkNames: boolean;
    refreshNames: string;
  };
  database: {
    DBimport: boolean;
    maxDBdays: Integer;
    DBinterval: Integer;
    useWAL: boolean;
    network: {
      parseARPcache: boolean;
      expire: Integer;
    };
  };
  webserver: {
    domain: string;
    acl: string;
    port: string;
    threads: Integer;
    session: {
      timeout: Integer;
      restore: boolean;
    };
    tls: {
      cert: string;
    };
    paths: {
      webroot: string;
      webhome: string;
    };
    interface: {
      boxed: boolean;
      theme: string;
    };
    api: {
      max_sessions: Integer;
      prettyJSON: boolean;
      password: string;
      pwhash: string;
      totp_secret: string;
      app_pwhash: string;
      app_sudo: boolean;
      cli_pw: boolean;
      excludeClients: string[];
      excludeDomains: string[];
      maxHistory: Integer;
      maxClients: Integer;
      client_history_global_max: boolean;
      allow_destructive: boolean;
      temp: {
        limit: number;
        unit: string;
      };
    };
    files: {
      pid: string;
      database: string;
      gravity: string;
      gravity_tmp: string;
      macvendor: string;
      setupVars: string;
      pcap: string;
      log: {
        ftl: string;
        dnsmasq: string;
        webserver: string;
      };
    };
    misc: {
      nice: Integer;
      delay_startup: Integer;
      addr2line: boolean;
      etc_dnsmasq_d: boolean;
      privacylevel: Integer;
      dnsmasq_lines: [string];
      extraLogging: boolean;
      readOnly: boolean;
      check: {
        load: boolean;
        shmem: Integer;
        disk: Integer;
      };
    };
    debug: {
      database: boolean;
      networking: boolean;
      locks: boolean;
      queries: boolean;
      flags: boolean;
      shmem: boolean;
      gc: boolean;
      arp: boolean;
      regex: boolean;
      api: boolean;
      tls: boolean;
      overtime: boolean;
      status: boolean;
      caps: boolean;
      dnssec: boolean;
      vectors: boolean;
      resolver: boolean;
      edns0: boolean;
      clients: boolean;
      aliasclients: boolean;
      events: boolean;
      helper: boolean;
      config: boolean;
      inotify: boolean;
      webserver: boolean;
      extra: boolean;
      reserved: boolean;
      ntp: boolean;
      netlink: boolean;
      all: boolean;
    };
  };
}

export interface PiholeList {
  address: string;
  type: PiholeDomainType;
  comment: string | null;
  groups: Integer[];
  enabled: boolean;
  id: Integer;
  date_added: UnixTimestamp;
  date_modified: UnixTimestamp;
  date_updated: UnixTimestamp;
  number: Integer;
  invalid_domains: Integer;
  abp_entries: Integer;
  status: Integer;
}
