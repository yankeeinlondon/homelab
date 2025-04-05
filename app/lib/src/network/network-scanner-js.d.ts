declare module "network-scanner-js" {
  // All interfaces should be inside the module declaration
  export interface NetworkScannerOptions {
    repeat?: number;
    size?: number;
    timeout?: number;
  }

  export interface PollResult {
    host: string;
    ip_address: string;
    status: string;
    res_avg: string;
    times: number[];
    packetLoss: string;
  }

  export interface TracerouteHop {
    hop: number;
    rtt1: string;
    rtt2: string;
    rtt3: string;
    ip: string;
  }

  export type Callback<T = any> = (result: T) => void;

  export interface SSHConfig {
    host: string;
    port: number;
    user: string;
    password?: string;
    privateKey?: string | Buffer;
  }

  // ... all other interfaces ...

  export default class NetworkScanner {
    /**
     * Sends ping requests to the given address.
     * @param address The target hostname or IP address.
     * @param config Optional configuration options.
     * @returns A promise that resolves with a PollResult.
     */
    poll(address: string, config?: NetworkScannerOptions): Promise<PollResult>;

    /**
     * Pings a list of addresses and returns the results via a callback.
     * @param addresses Array of hostnames/IP addresses.
     * @param cb Callback invoked with an array of PollResult.
     */
    clusterPing(addresses: string[], cb: Callback<PollResult[]>): void;

    /**
     * Scans the given IP range and calls the callback for each discovered host.
     * @param address An IP range (e.g. "192.168.1.0-254").
     * @param cb Callback invoked with each discovered host.
     */
    ipScan(address: string, cb: Callback<string>): void;

    /**
     * Performs a traceroute to the given address.
     * @param address The target hostname or IP address.
     * @param cb Callback invoked with each hop’s details.
     */
    traceroute(address: string, cb: Callback<TracerouteHop>): void;

    // Additional (optional) methods:
    
    /**
     * Opens a web UI that displays latency stats for a list of hosts.
     * @param hosts Array of hostnames/IP addresses.
     */
    monitorCluster(hosts: string[]): void;

    /**
     * Tests connection speed.
     * @param connectionType 'multi' for multiple connections or 'single' for one connection.
     * @returns A promise that resolves with the speed (in Mbps).
     */
    speedTest(connectionType?: 'multi' | 'single'): Promise<number>;

    /**
     * Executes SSH commands on a remote host.
     * @param config SSH configuration.
     * @param cb Callback invoked with the command output.
     */
    ssh(config: SSHConfig, cb: Callback<string>): void;

    /**
     * Calculates the subnet details for a given subnet.
     * @param subnet A subnet string in CIDR notation (e.g. "192.168.1.0/24").
     * @returns A promise that resolves with the subnet details.
     */
    getSubnet(subnet: string): Promise<SubnetResult>;

    /**
     * Creates a network server on the specified port.
     * @param port Port number.
     * @returns A SocketServer instance.
     */
    netServer(port: number): SocketServer;

    /**
     * Connects to a network server.
     * @param serverAddress The server address.
     * @returns A SocketClient instance.
     */
    netClient(serverAddress: string): SocketClient;

    /**
     * Looks up the vendor of a given MAC address.
     * @param mac The MAC address.
     * @returns A promise that resolves with the vendor name.
     */
    macLookup(mac: string): Promise<string>;

    /**
     * Resolves a domain to an IP address.
     * @param domain The domain name.
     * @param cb Callback invoked with the IP address.
     */
    lookup(domain: string, cb: Callback<string>): void;

    /**
     * Retrieves the SSL certificate details for a given URL.
     * @param url The URL to check.
     * @returns A promise that resolves with the SSL certificate.
     */
    getSsl(url: string): Promise<SSLCert>;

    // Additional properties:
    pollInterval: number;
    sshCommands: string[];
  }
}
