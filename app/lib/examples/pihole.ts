#!/usr/bin/env bun run 

import { exit } from "node:process";
import { isOk, Pihole } from "../src/index"

const pi = await Pihole.authorize({
    skipValidation: true
});

if(isOk(pi)) {
    const summary = await pi.metrics.getStatsSummary();
    if(isOk(summary)) {
        console.log();
        console.log(`Pihole Summary\n`)
        console.log(summary);
        console.log();
    } else {
        console.log();
        console.log(`Failed to get Pihole Summary`);
        console.log(summary);
        console.log();
        exit(1);
    }

} else {
    console.log();
    console.log(pi);
    console.log();
    exit(1);
}

