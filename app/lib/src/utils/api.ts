import type {   
    DefineObject,  
    Dictionary,  
    Extends,  
    Or,  
    Suggest 
} from "inferred-types"
import type { HttpVerb } from "~/types";
import type { AwsRegion, AwsService } from "~/types/aws";

export type ApiAuthMethod = 
| "none"
| "Bearer Token"
| `API Token`
| `JWT Bearer`
| `AWS Signature`
| `Basic Auth`
| `Digest Auth`
| `OAuth1`
| `OAuth2`
| `Hawk`;

export type JwtAlgorithm = 
| "HS256"
| "HS384"
| "HS512"
| "RS256"
| "RS384"
| "RS512"
| "PS256"
| "PS384"
| "PS512"
| "ES256"
| "ES384"
| "ES512"
;

export type ApiAuthLocation = "header" | "query-parameters" | "path";

export type ApiAuthDetails<T extends ApiAuthMethod> = 
Or<[
    Extends<T, "none">, Extends<T, "Bearer Token">
]> extends true 
? []
: T extends "JWT Bearer"
? [ 
    algo: JwtAlgorithm, 
    baseEncoded: boolean, 
    located: Exclude<ApiAuthLocation, "path">, 
    headerPrefix: Suggest<"Bearer "> 
]
: T extends "AWS Signature"
? [
    located: Exclude<ApiAuthLocation, "query-parameters">,
    region?: AwsRegion,
    service?: Suggest<AwsService>,
    sessionToken?: string
]
: [];

export type RestApiCall<TVerb extends HttpVerb> = <TReqParams extends Dictionary<string>>(params: TReqParams) => {

}

export type ApiRestPath = {
    path: string;
    desc?: string;
    get?: {req: RestApiCall<"GET">, desc?: string};
    post?: {req: RestApiCall<"POST">, desc?: string};
    patch?: {req: RestApiCall<"PATCH">, desc?: string};
    put?: {req: RestApiCall<"PUT">, desc?: string};
    delete?: {req: RestApiCall<"DELETE">, desc?: string};
    head?: {req: RestApiCall<"HEAD">, desc?: string};
}


export function pathApi(path: string, desc?: string) {

    return {
        get<TErrCodes extends readonly number[]>(
            request: DefineObject,
            response: "string" | "number" | DefineObject,
            expectedErrorCodes: TErrCodes,
            errHandler?: any
        ) {

        }
    }
}

export type ApiEnvironment = {
    name: string;
    baseUrl: string;
    desc?: string;
}

function api<
    TState extends {
        name: string;
        paths: readonly ApiRestPath[];
        authMethod: ApiAuthMethod;
        authDetails: ApiAuthDetails<ApiAuthMethod>;
        baseUrl?: string;
        environments?: ApiEnvironment[];
    }
>(state: TState) {
    return {
            addPath(path: string, desc?: string) {
                return pathApi(path, desc)
            },
            /** 
             * Add a base URL to the environment for APIs
             * which will have a single static base URL path.
             */
            addBaseUrl(url: string) { 

            },
            /**
             * Allow an ENV variables (or set of ENV variables)
             * to dictate the BaseUrl. Making this dynamic based
             * on the ENV variables used at time of calling.
             */
            addBaseUrlEnv<T extends readonly string[]>(...urlEnvVars: T) {

            },

            /**
             * In contrast to having a singular base environment, it may be
             * better to use 
             */
            addEnv(name: string, baseUrl: string, desc?: string) {
                return {
                    ...state,
                    environments: state.environments
                        ? state.environments.push({name,baseUrl,desc})
                        : [{name,baseUrl,desc}]
                }
            }
    }
}

export function createRestApi<
    TAuth extends ApiAuthMethod,
    TAuthDetails extends ApiAuthDetails<TAuth>
>(
    name: string,
    authMethod: TAuth,
    ...authDetails: TAuthDetails
) {

    return api({
        name,
        authMethod,
        authDetails,
        paths: []
    });
}
