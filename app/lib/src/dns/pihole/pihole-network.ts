import type { PiholeDevice, PiholeGateway, PiholeInterface, PiholeRoute } from "~/types";
import { piholeApiCall } from "~/utils";

export type PiholeGetDevicesReq = {
  max_devices?: number;
  max_addresses?: number;
}

export interface PiholeGetDevicesRes {
  devices: PiholeDevice[];
  took: number;
}

export type PiholeGetGatewayReq = {
  detailed?: boolean;
}

export type PiholeGetGatewayRes<D extends boolean> = {
  gateway: PiholeGateway<D>[];
  took: number;
}

export type PiholeGetInterfacesReq ={
  detailed?: boolean;
}

export type PiholeGetInterfacesRes = {
  interfaces: PiholeInterface[];
  took: number;
}

export type PiholeGetRoutesReq = {
  detailed?: boolean;
}

export type PiholeGetRoutesRes = {
  routes: PiholeRoute[];
  took: number;
}

export function piholeNetworkApi(
  address: string,
  sid: string,
) {
  const api = piholeApiCall(address, sid);

  return {
    /**
     * [Get Devices](https://ftl.pi-hole.net/master/docs/#get-/network/devices)
     *
     * Get info about the devices in your local network as seen by your Pi-hole.
     *
     * This API hook returns info about the devices in your local network as
     * seen by your Pi-hole. By default, this number of shown devices is limited
     * to 10. Devices are ordered by when your Pi-hole has received the last
     * query from this device (most recent first)
     */
    getDevices(
      opt?: PiholeGetDevicesReq,
    ) {
      opt = {
        max_devices: 10,
        max_addresses: 3,
        ...opt,
      };
      return api<[PiholeGetDevicesReq, PiholeGetDevicesRes]>(
        "GET",
        "getDevices",
        "network/devices",
        {
          qp: opt,
        },
      );
    },

    /**
     * [Get Gateway](https://ftl.pi-hole.net/master/docs/#get-/network/gateway)
     *
     * This API hook returns infos about the gateway of your Pi-hole.
     *
     * - If the optional parameter `detailed` is set to true, the response will
     * include detailed information about the individual interfaces and routes.
     * Note that the available information is dependent on the interface type
     * and state.
     *
     */
    getGateway<D extends boolean = false>(
            /** @default false */
            detailed: D = false as D,
    ) {
      return api<[PiholeGetGatewayReq, PiholeGetGatewayRes<D>]>(
        "GET",
        "getGateway",
        "network/gateway",
        {
          qp: { detailed },
        },
      );
    },

    /**
     * [Get Interfaces](https://ftl.pi-hole.net/master/docs/#get-/network/interfaces)
     *
     * Get info about the interfaces of your Pi-hole.
     */
    getInterfaces<D extends boolean = false>(
            /** @default false */
            detailed: D = false as D,
    ) {
      return api<[PiholeGetInterfacesReq, PiholeGetInterfacesRes]>(
        "GET",
        "getGateway",
        "network/gateway",
        {
          qp: { detailed },
        },
      );
    },

    /**
     * [Get Routes](https://ftl.pi-hole.net/master/docs/#get-/network/routes)
     *
     * Get info about the routes of your Pi-hole.
     *
     * This API hook returns info about the networking routes of your Pi-hole.
     * Note that not all described fields are applicable to any routing type.
     * Users must not rely on the presence of any field without checking the
     * route type first.
     */
    getRoutes<D extends boolean = false>(
            /** @default false */
            detailed: D = false as D,
    ) {
      return api<[PiholeGetRoutesReq, PiholeGetRoutesRes]>(
        "GET",
        "getGateway",
        "network/gateway",
        {
          qp: { detailed },
        },
      );
    },

  };
}
