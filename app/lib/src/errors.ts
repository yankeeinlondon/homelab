import { createKindError } from "@yankeeinlondon/kind-error";
import type { PiholeApi } from "./pihole";

export function PiholeApiError(config: PiholeApi) {
  return createKindError(
    "PiholeApiError",
    { baseUrl: config.baseUrl, sid: config.sid },
  );
}

export function ProxmoxApiError(host: string, key: string) {
    return createKindError(
        "ProxmoxApiError",
        { host, key }
    )
}


export function NotFound(address: string, sid: string) {
  return createKindError(
    "NotFound",
    { address, sid, code: 404 },
  );
}

export const FailedAuth = createKindError(
  "FailedAuth", {
    code: 401
  }
);

export const RequirementMissing = createKindError(
  "RequirementMissing", {
    code: 500
  }
);

export const InvalidNetworkAddress = createKindError(
    "InvalidNetworkAddress", {
        code: 400
    }
)

export const UnexpectedError = createKindError("Unexpected", {
    code: 400
});

console.log(UnexpectedError.name);

