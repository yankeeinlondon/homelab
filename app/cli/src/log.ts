import { stdout, stderr } from "node:process"
import { isArray, isObject } from "inferred-types";

export function info(...args: any[]) {
    for (const arg of args) {
        stderr.write(isObject(arg) || isArray(arg) 
            ? JSON.stringify(arg, null, 2) 
            : String(arg));
        stderr.write("\n");
    }
}

export function warn(...args: any[]) {
    for (const arg of args) {
        stderr.write(isObject(arg) || isArray(arg) 
            ? JSON.stringify(arg, null, 2) 
            : String(arg));
        stderr.write("\n");
    }
}

export function output(...args: any[]) {
    for (const arg of args) {
        stdout.write(isObject(arg) || isArray(arg) 
            ? JSON.stringify(arg, null, 2) 
            : String(arg));
        stdout.write("\n");
    }
}
