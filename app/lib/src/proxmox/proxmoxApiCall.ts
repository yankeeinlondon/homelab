import { isDefined, isObject, isString, type Dictionary } from "inferred-types";
import { ProxmoxApiError } from "~/errors";
import type { HttpVerb, PiholeApiConfig } from "~/types";
import { asQueryParameter } from "~/utils";

function stringify(body: unknown) {
    return isString(body)
        ? body
        : isObject(body)
            ? JSON.stringify(body)
            : String(body);
}

function isErrorResponse(val: unknown): boolean {
    return isObject(val) && (
        "errors" in val
        || "error" in val
        || Object.keys(val).reduce(
            (acc, key) => isObject(val[key]) && "errors" in val[key]
                ? true
                : acc,
            false,
        )
    );
}

function endpoint<
  T extends string,
  Q extends Record<string, unknown>,
>(address: T, offset: string, qpDefn?: Q) {
  const qp = asQueryParameter((qpDefn || {}));

  return offset === ""
      ? `https://${address}:8006/api2/json${qp}`
      : `https://${address}:8006/api2/json/${offset}${qp}`
}

// interface ExtendedRequestInit extends RequestInit {
//     agent?: (parsedURL: URL) => Agent | undefined;
// }

export function proxmoxApiCall(
    host: string,
    key: string,
) {
    const error = ProxmoxApiError(host, `${key.slice(0, 4)}...${key.slice(-4,key.length)}`);
    const authorization = { 
        Authorization: `Bearer ${key}`,
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br"
    }

    return async <
        TSchema extends [req: Dictionary<string>, resp: unknown] = [never, unknown],
        TVerb extends HttpVerb = HttpVerb,
    >(
        verb: TVerb,
        name: string,
        path: string,
        config: TVerb extends "GET" ? PiholeApiConfig<never, TSchema[0]> : PiholeApiConfig<TSchema[0]> = {},
    ): Promise<TSchema[1] | Error> => {
        const url = verb === "GET" && isDefined(config.qp)
            ? endpoint(host, path, config.qp)
            : endpoint(host, path);

        // TODO: This isn't great but the builtin `fetch` does
        // not support adding an https agent which will accept
        // local certs
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0' 
        
        const opt = config.body
            ? { 
                method: verb, 
                body: stringify(config.body), 
                headers: authorization 
            }
            : { method: verb, headers: authorization };

        const req = await fetch(url, opt);

        if (req.ok) {
            const result = await req.json();
            if (isErrorResponse(result)) {

                return error(
                    `Request to "${name}" [${url}] had errors in response`,
                    {
                        result,
                        ...(config.body ? { body: config.body } : {}),
                        verb,
                        url,
                    },
                );
            }
            else {
                return result;
            }
        }
        else {

            return error(
                `Failed [${req.status}] calling Proxmox API endpoint "${name}" from: ${url}!`,
                {
                    verb,
                    url,
                    code: req.status,
                    msg: req.statusText,
                    name,
                    ...(config.body ? { body: config.body } : {}),
                },
            );
        }
    };
}
