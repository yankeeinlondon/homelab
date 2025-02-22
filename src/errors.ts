import { createKindError } from "@yankeeinlondon/kind-error";

export const PiholeApiError = (
    address: string,
    sid: string
) => createKindError(
    "PiholeApiError",
    { address, sid }
)

export const NotFound = (
    address: string,
    sid: string
) => createKindError(
    "NotFound",
    { address, sid, code: 404 }
)


export const FailedAuth = createKindError(
    "FailedAuth"
)

export const RequirementMissing = createKindError(
    "RequirementsMissing"
)
