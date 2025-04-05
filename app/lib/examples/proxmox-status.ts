#!/usr/bin/env bun run 

import {
    Proxmox
} from "../src/index";


const api = Proxmox(
    "192.168.100.2", 
    "PVEAPIToken=auditor@pve!LqQ-m3KqeGFQWs.nrrQncn6p=8cd1ca1e-de25-4d59-b0aa-2312c1166f22"
);

const status = await api.cluster.getClusterHaStatusCurrent();

console.log(status);
