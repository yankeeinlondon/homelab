import type { Dictionary } from "inferred-types";
import type { HttpVerb, PiholeApiConfig } from "~/types";
import chalk from "chalk";
import {  isObject, isString } from "inferred-types";
import { PiholeApiError, ProxmoxApiError } from "~/errors";
import { asQueryParameter, isOk, request } from "~/utils";
import type { PiholeApi } from "./pihole";
import { join } from "node:path";

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
>(
    api: PiholeApi, 
    offset: string, 
    config: PiholeApiConfig<any,any>
) {
  const qp = config.qp 
    ? asQueryParameter({...config.qp, sid: api.sid})
    : asQueryParameter({ sid: api.sid });

  return join(api.baseUrl, `${offset}${qp}`)
}

export function piholeApiCall(
    api: PiholeApi
) {
    const { sid, baseUrl, skipValidation } = api;

    return async <
        TSchema extends [req: Dictionary<string>, resp: unknown] = [never, unknown],
        TVerb extends HttpVerb = HttpVerb,
    >(
        verb: TVerb,
        name: string,
        path: string,
        config: TVerb extends "GET" ? PiholeApiConfig<never, TSchema[0]> : PiholeApiConfig<TSchema[0]> = {},
    ): Promise<TSchema[1] | Error> => {
        const fetch = request({
            baseUrl,
            skipValidation,
            // defaultError: PiholeApiError(api)
        });

        // const headers = {
        //     Accept: "*/*",
        //     "Accept-Encoding": "gzip, deflate, br"
        // };
        // const url = verb === "GET" && isDefined(config.qp)
        //     ? endpoint(address, path, sid, config.qp)
        //     : endpoint(address, path, sid);
        // const opt = config.body
        //     ? { method: verb, body: stringify(config.body), headers }
        //     : { method: verb, headers };
        

        const req = await fetch(endpoint(api,path,config), {
            method: verb,
        });
        

        if (isOk(req)) {
            const result = await req.json();
            if (isErrorResponse(result)) {

                return error(
                    `Request to "${name}" [${join(baseUrl,path)}] had errors in response`,
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
                `Failed [${req.status}] calling Pihole API endpoint "${name}" from ${chalk.blue(url)}!`,
                {
                    verb,
                    url,
                    code: req.status,
                    name,
                    ...(config.body ? { body: config.body } : {}),
                },
            );
        }
    };
}


