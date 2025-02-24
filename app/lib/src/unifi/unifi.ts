import type { UnifiListDeviceReq, UnifiListHostReq } from "~/types";

const BASE_URL="https://api.ui.com/ea"

function unifiApi(key: string) {

    return {
        listHosts(opt?: UnifiListHostReq) {
            
        },
        listDevices(opt?: UnifiListDeviceReq) {
            
        },
        getHourlyIspMetrics() {

        },
        getDetailedIspMetrics() {
            
        }
    }

}


export const Unifi = {
    apiKey(key: string) {
        return unifiApi(key);        
    }
}
