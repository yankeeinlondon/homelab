import type { AllowBlock, PiholeDomainType, PiholeList } from "~/types";
import { piholeApiCall } from "./api";
import { isDefined } from "inferred-types";

export function piholeListApi(
    address: string,
    sid: string
) {
    const api = piholeApiCall(address, sid);

    return {
        /**
         * [Get Lists](https://ftl.pi-hole.net/master/docs/#get-/lists/-list-)
         * 
         * {list} is optional. Specifying it will result in only the requested list
         * being returned.
         */
        getLists(
            opt?: {
                list?: string,
                type?: AllowBlock
            }
        ) {
            return api<[{type?: AllowBlock | null}, {lists: PiholeList[]; took: number}]>(
                "GET",
                "getLists",
                opt?.list ? `lists/${opt.list}` : "lists",
                {
                    qp: {type: opt?.type}
                }
            )
        }
    }

}
