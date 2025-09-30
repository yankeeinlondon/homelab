import { isObject } from "inferred-types";

/**
 * Type guard that validates that `val` is a `Response` object from
 * the Javascript **fetch** function.
 */
export function isResponse(val:unknown): val is Response {
    return isObject(val) && "ok" in val && typeof val.ok === "boolean" && "status" in val && typeof val.status === "number"
}
