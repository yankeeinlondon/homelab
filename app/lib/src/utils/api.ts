import type { Dictionary } from "inferred-types";
import type { HttpVerb, PiholeApiConfig } from "~/types";
import chalk from "chalk";
import { isDefined, isObject, isString } from "inferred-types";
import { PiholeApiError, ProxmoxApiError } from "~/errors";
import {  endpoint } from "~/utils";

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

export function piholeApiCall(
  address: string,
  sid: string,
) {
  const error = PiholeApiError(address, sid);

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
      ? endpoint(address, path, sid, config.qp)
      : endpoint(address, path, sid);
    const opt = config.body
      ? { method: verb, body: stringify(config.body) }
      : { method: verb };
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


export function proxmoxApiCall(
    host: string,
    key: string,
  ) {
    const error = ProxmoxApiError(host, key.slice(0,4));
    const authorization = { Authorization: `Bearer ${key}`}
  
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
        ? endpoint(host, path, key, config.qp)
        : endpoint(host, path, key);
      const opt = config.body
        ? { method: verb, body: stringify(config.body), headers: authorization }
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
          `Failed [${req.status}] calling Proxmox API endpoint "${name}" from ${chalk.blue(url)}!`,
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
  