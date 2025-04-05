import { isDefined } from "inferred-types";
import { FailedAuth, RequirementMissing } from "~/errors";
import type { 
    PiholeAuthReponse__FAILURE, 
    PiholeAuthResp, 
    PiholeAuthResponse__SUCCESS 
} from "~/types";
import { endpoint } from "./piholeApiCall";

export function isSuccessfulPiholeAuth(resp: PiholeAuthResp): resp is PiholeAuthResponse__SUCCESS {
    return !("error" in (resp as PiholeAuthReponse__FAILURE));
}

export async function authorize(
    address: string
): Promise<Error | PiholeAuthResponse__SUCCESS> {
    let password: string = "";
    if (address.includes("dns")) {
      const envVar = address.split(".")[0].toUpperCase().replace("-", "_");
      if (isDefined(process.env[envVar])) {
        password = process.env[envVar];
      }
      else if (isDefined(process.env.PASSWORD)) {
        password = process.env.PASSWORD;
      }
      else {
        return RequirementMissing(`Pihole could not authorize because no password is known for the address: ${address}`);
      }
    }
    const url = endpoint(address, "auth"); 
    const req = JSON.stringify({
      password,
    });
  
    const resp = await fetch(url, { method: "POST", body: req });
  
    if (resp.ok) {
      const result = await resp.json() as PiholeAuthResp;
      if (isSuccessfulPiholeAuth(result)) {
        return result;
      }
      else {
        return FailedAuth(`Failed to authorize to Pihole server at ${url}`, {
          url,
          error: result.error,
        });
      }
    }
    else {
      return FailedAuth(`Failed to authorize to Pihole server at ${url}`, {
        url,
        code: resp.status,
        msg: resp.statusText,
      });
    }
  }
