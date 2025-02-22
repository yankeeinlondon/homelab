import { keysOf, withoutValue, type Narrowable } from "inferred-types";

export function asQueryParameter<
    T extends Record<K,V>,
    K extends string,
    V extends Narrowable
>(defn: T) {
    const qp: string[] = [];
    const withValue = withoutValue("undefined")(defn);

    for (const key of Object.keys(withValue)) {
        const value = withValue[key as keyof typeof withValue];
        qp.push(`${key}=${encodeURI(String(value))}`)
    }
    
    return Object.keys(withValue).length === 0
        ? ""
        : `?${qp.join("&")}`
}
