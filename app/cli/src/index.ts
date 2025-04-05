import {  Network } from "@yankeeinlondon/homelab";
import { isError } from "@yankeeinlondon/kind-error"

export * from "./constants";

// const api = Proxmox("192.168.100.2", "PVEAPIToken=auditor@pve!LqQ-m3KqeGFQWs.nrrQncn6p=8cd1ca1e-de25-4d59-b0aa-2312c1166f22");
// const data = await api.nodes("pve").tasks.getTasks();

// const api = await Pihole.authorize("dns2.home.ken.net");

// if(isError(api)) {
//     log(api);
//     exit(1)
// }
// console.log(data);

const net = Network.ping("192.1")
