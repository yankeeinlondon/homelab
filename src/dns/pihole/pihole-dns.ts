import type { PiholeBlockingStatus } from "~/types";
import { piholeApiCall } from "./api";

export type PiholeBlockingStatusResponse = {
    blocking: PiholeBlockingStatus;
    timer: null | number;
    took: number;
};

export type PihholeBlockingReq ={
    blocking: boolean;
    timer?: number | null;
}


export function piholeDnsApi(
    address: string,
    sid: string
) {
    const api = piholeApiCall(address, sid);

    return {
        /**
         * [Get Blocking Status](https://ftl.pi-hole.net/master/docs/#get-/dns/blocking)
         * 
         * The property timer may contain additional details concerning a temporary 
         * en-/disabling. It is null when no timer is active (the current status is 
         * permanent).
         */
        getBlockingStatus() {
            return api<[never, PiholeBlockingStatusResponse]>(
                "GET",
                "getBlockingStatus",
                "dns/blocking"
            )
        },

        /**
         * [Set Blocking Status](https://ftl.pi-hole.net/master/docs/#post-/dns/blocking)
         * 
         * Change the current blocking mode by setting blocking to the desired 
         * value. The optional timer object may used to set a timer. Once this timer 
         * elapsed, the opposite blocking mode is automatically set. For instance, 
         * you can request {blocking: false, timer: 60} to disable Pi-hole for one 
         * minute. Blocking will be automatically resumed afterwards.
         * 
         * You can terminate a possibly running timer by setting timer to null (the 
         * set mode becomes permanent).
         */
        setBlockingStatus(
            blocking: boolean,
            timer?: number | null
        ) {
            return api<[PihholeBlockingReq, PiholeBlockingStatusResponse]>(
                "POST",
                "setBlockingStatus",
                "dns/blocking",
                { body: {blocking,timer}}
            )
        },
    }

}
