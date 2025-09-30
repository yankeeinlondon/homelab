import type { AllowBlock, PiholeList } from "~/types";
import { piholeApiCall } from "./piholeApiCall";
import type { PiholeApi } from "./pihole";


export function piholeListApi(
  config: PiholeApi
) {
  const api = piholeApiCall(config);

  return {
    /**
     * [Get Lists](https://ftl.pi-hole.net/master/docs/#get-/lists/-list-)
     *
     * {list} is optional. Specifying it will result in only the requested list
     * being returned.
     */
    getLists(
      opt?: {
        list?: string;
        type?: AllowBlock;
      },
    ) {
      return api<[{ type?: AllowBlock | null }, { lists: PiholeList[]; took: number }]>(
        "GET",
        "getLists",
        opt?.list ? `lists/${opt.list}` : "lists",
        {
          qp: { type: opt?.type },
        },
      );
    },
  };
}
