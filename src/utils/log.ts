import { isArray, isObject } from "inferred-types";

export function info(...args: any[]) {
    for (const arg of args) {
        process.stderr.write(isObject(arg) || isArray(arg) ? JSON.stringify(arg, null, 2) : String(arg));
        process.stderr.write("\n");
    }
}

export function warn(...args: any[]) {
    for (const arg of args) {
        process.stderr.write(isObject(arg) || isArray(arg) ? JSON.stringify(arg, null, 2) : String(arg));
        process.stderr.write("\n");
    }
}

export function output(...args: any[]) {
    for (const arg of args) {
        process.stdout.write(isObject(arg) || isArray(arg) ? JSON.stringify(arg, null, 2) : String(arg));
        process.stdout.write("\n");
    }
}
