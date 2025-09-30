import { ALPHA_CHARS, isIp4Address, isIp6Address, isString, NUMERIC_CHAR, stripChars, stripLeading } from "inferred-types";

export function isDnsAddress(val: unknown): boolean {
    return isString(val) && stripChars(val, ...ALPHA_CHARS, ...NUMERIC_CHAR, ".", "-") === "" && !val.includes("..")
}

function stripProtocol(val: string) {
    return stripLeading(stripLeading(val, "http://"), "https://")
}

/**
 * Validates that the `val` passed in appears to be a
 * Server address (aka, IP Address or DNS name).
 */
export function isValidServerAddress(val: unknown): boolean {
    return (
        isString(val) && (
            isIp4Address(stripProtocol(val)) || isIp6Address(stripProtocol(val)) || isDnsAddress(stripProtocol(val))
        )
    )
}
