import { Proxmox } from "@yankeeinlondon/homelab"
export * from "./constants";

const api = Proxmox("192.168.100.2", "f559d918-9558-464d-8e57-e7a216260c46");
const data = await api.storage.getStorage();

console.log(data)
