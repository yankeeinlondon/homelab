import { ensureLeading, isDefined } from "inferred-types";
import { FailedAuth, InvalidNetworkAddress, RequirementMissing, UnexpectedError } from "~/errors";
import type {
    PiholeAuthReponse__FAILURE,
    PiholeAuthResp,
    PiholeAuthResponse__SUCCESS
} from "~/types";
import { env } from "node:process";
import { hasUrlProtocol, isOk, isResponse, isValidServerAddress, request } from "~/utils";
import { isError } from "~/type-guards";
import type { PiholeApi } from "./pihole";

export function isSuccessfulPiholeAuth(resp: PiholeAuthResp): resp is PiholeAuthResponse__SUCCESS {
    return !("error" in (resp as PiholeAuthReponse__FAILURE));
}

export type PiholeAuthOptions = {
    /** 
     * Server address as DNS name or IP address (e.g., dns1 or 192.168.100.55). 
     * 
     * - if no address passed in then it will try to find a valid server 
     * address in the PIHOLE_SERVER environment variable.
     */
    address?: string,
    /**
     * The password for the Pihole server. If not passed in then any value
     * provided in the PIHOLE_PASSWORD environment variable will be 
     */
    password?: string,

    /**
     * Skips the Pihole server's SSL certificate validatation. Useful for
     * when your Pihole's certificate is a private certificate unknown to public
     * certificate authorities.
     */
    skipValidation?: boolean;
}

/**
 * Authorizes a Pihole client against a specified server. Where:
 * 
 * - Server **address** is explicitly passed in OR available in PIHOLE_SERVER
 * environment variable
 */
export async function authorize(
    opt?: PiholeAuthOptions
): Promise<Error | (PiholeAuthResponse__SUCCESS & PiholeApi)> {
    let server = opt?.address || env.PIHOLE_SERVER;
    if (!server) {
        return RequirementMissing(`Pihole authorization failed because the Pihole server's address could not be determined. Either ensure that the ENV variable PIHOLE_SERVER is set or that the call to authorize() has a valid server address passed in.`)
    }

    if (!isValidServerAddress(server)) {
        return InvalidNetworkAddress(`Pihole was provided an invalid value of "${server}" for the server address. Use either a DNS or IP address to correctly reference this server in the environment variable PIHOLE_SERVER or pass the value directly in with the call to authorize()!`)
    }

    const pwd = opt?.password || env.PIHOLE_PASSWORD;

    if (!pwd) {
        return RequirementMissing(`Pihole could not authorize because no password was provided. Pass the password directly into the authorize() call or ensure that the PIHOLE_PASSWORD environment variable is set.`);
    }

    const url = hasUrlProtocol(server) ? server : ensureLeading(server, "https://");
    const body = JSON.stringify({
        password: pwd,
    });

    // const resp = await fetch(url, { method: "POST", body: req });
    const resp = await request({
        ctx: { server, password_provided: pwd !== "" },
        skip_validation: opt?.skipValidation
    })(
        url,
        { method: "POST", body }
    );

    if (isOk(resp)) {
        const result = await resp.json() as PiholeAuthResp;
        if (isSuccessfulPiholeAuth(result)) {
            return {
                ...result,
                server
            };
        }
        else {
            return FailedAuth(`Failed to authorize to Pihole server at ${url}`, {
                url,
                error: result.error,
            });
        }
    }
    else if (isError(resp)) {
        return resp
    } else {
        return UnexpectedError.proxy(resp);
    }


}
