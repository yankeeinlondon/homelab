import type { PiholeConfig } from "~/types";
import { piholeApiCall } from "./piholeApiCall";
import type { PiholeApi } from "./pihole";


export function piholeConfigApi(
  config: PiholeApi
) {
  const api = piholeApiCall(config);

  return {
    getConfig<D extends boolean = false>(
            detailed: D = false as D,
    ) {
      return api<[{ detailed: boolean }, PiholeConfig]>(
        "GET",
        "getConfig",
        "config",
        {
          qp: { detailed },
        },
      );
    },
  };
}
