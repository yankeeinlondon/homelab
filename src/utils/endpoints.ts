import { asQueryParameter } from "./asQueryParameter";

export const endpoint = <
    T extends string,
    Q extends Record<string, unknown>
>(
    address: T, 
    offset: string,
    sid?: string,
    qpDefn?: Q
) =>  {
    const qp = asQueryParameter({
        sid,
        ...(qpDefn ? qpDefn : {})
    });

    return sid 
    ? offset === ""
        ? `http://${address}/api${qp}`
        : `http://${address}/api/${offset}${qp}`
    : `http://${address}/api/${offset}`
}
