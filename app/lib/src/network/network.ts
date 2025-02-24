import { 
    isDomainName, 
    isIp4Address, 
    isIp6Address, 
    type Ip4Address, 
    type Ip6Address, 
    type Suggest 
} from "inferred-types";
import { InvalidNetworkAddress } from "~/errors";
import NetworkScanner from "network-scanner-js";

let netScan = new NetworkScanner();

type ExampleNetworks = 
| "192.168.1.1"
| "192.168.10.1"
| "192.168.20.1"
| "192.168.30.1"
| "192.168.40.1"
| "192.168.50.1"
| "192.168.60.1"
| "192.168.70.1"
| "192.168.70.1"
| "192.168.80.1"
| "192.168.90.1"
| "192.168.100.1"
| "10.10.1.1"
| "10.10.10.1"
| "10.10.20.1"
| "10.10.30.1"
| "10.10.40.1"
| "10.10.50.1"
| "10.10.60.1"
| "10.10.70.1"
| "10.10.80.1"
| "10.10.90.1"
| "fe80::0000:0000:0000:0000"
| "10.10.100.1"
| "server.local"
| "server.home"
| "server.net";

export const Network = {
    /**
     * ping a network address
     */
    async ping<T extends Suggest<ExampleNetworks>>(
        address:  T
    ) {
        if (!isIp4Address(address) && !isIp6Address(address) && !isDomainName(address)) {
            return InvalidNetworkAddress(`ping() was passed an invalid address of "${address}"`, {address})
        }

        // const poll = await netScan.poll(address, config);

    }
}


