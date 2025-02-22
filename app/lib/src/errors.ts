import { createKindError } from "@yankeeinlondon/kind-error";

export function PiholeApiError(address: string, sid: string) {
  return createKindError(
    "PiholeApiError",
    { address, sid },
  );
}

export function NotFound(address: string, sid: string) {
  return createKindError(
    "NotFound",
    { address, sid, code: 404 },
  );
}

export const FailedAuth = createKindError(
  "FailedAuth",
);

export const RequirementMissing = createKindError(
  "RequirementsMissing",
);
