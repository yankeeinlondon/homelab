import { isObject, type EmptyObject } from "inferred-types";
import { isOk } from "./isOk";
import { createKindError, isError, type KindError, type KindErrorType } from "@yankeeinlondon/kind-error";

export type ErrorLike = {
    /**
     * native fetch events which produce errors will sometimes provide
     * a an error **code** which is a string value.
     */
    code?: string | number;
    /**
     * native fetch events which produce errors will sometimes provide a
     * **path** variable which represents the URL path which failed.
     */
    path?: string;

    /**
     * native fetch events will sometimes produce a numeric error code
     * for the error caught
     */
    errno?: number;

    type?: string;
    subType?: string;
}

export type HttpError = Error & {
    code: number;
    url: string;
}

export type RequestOptions<
    TErr extends KindErrorType | undefined = KindErrorType
> = {
    /**
     * key-value pairs which provide context to the error
     */
    ctx?: Record<string, string|boolean|number|undefined>;
    /**
     * a handler which takes an `Error` object caught during processing
     * and returns a `KindError` object (typically) or a valid return type
     * (where possible).
     */
    errorHandler?: (reason: Error) => KindError;

    /**
     * Allows callback execution when the _finally_ event is fired for
     * the request's promise.
     */
    finally?: () => void;

    /**
     * Allows you to specify the "base URL" for all endpoints allowing
     * those endpoints to only use the _relative_ path to a given endpoints.
     */
    baseUrl?: string;

    /**
     * The default error type to use when an error is _caught_.
     */
    defaultError?: TErr;

    /**
     * Allows you to express the broad format
     * for which you expect the response to come in as.
     */
    response?: "formData" | "json" | "text" | "auto";

    /**
     * Instructs the fetch command **not** to validate the SSL certificate
     * provided by the server. Use this only if you know that the server's
     * certificate is a valid _but private_ certificate.
     */
    skipValidation?: boolean;
}

function isErrorLike(val: unknown): val is ErrorLike {
    return isError(val) || isObject(val)

}


function defaultErrHandler<
    TOpt extends RequestOptions,
    TInput extends string | URL | globalThis.Request,
    TInit extends RequestInit | undefined
>(
    opt: TOpt,
    input: TInput,
    init: TInit
) {
    const method = init?.method || "GET"; 
    const url = input;
    const stack = new Error().stack;

    return <T>(err: T) => {
        if (isErrorLike(err)) {
            if(err?.code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE") {
                const CorsError = createKindError(
                    "CORS",
                    {
                        ...(opt.ctx ? opt.ctx : {}), 
                        url, 
                        method, 
                        code: err.errno,
                        type: err.code,
                        suggestion: `This error indicates that the SSL certificate provided by the server was unable to be verified. If you are using a private cert and do are ok to forgo the validation step make sure to set skip_validation property to 'true' in the request's options.`
                    } 
                )
                return CorsError.proxy({
                    stack, 
                    ...err
                } as any);
            }
        }

        else {
            const RequestError = createKindError(
                "RequestError", 
                { url, method, ...(opt ? opt : {}) }
            );
            return RequestError.proxy(err);
        }
    }
}


function defaultHeaders<TInit extends RequestInit>(init?: TInit) {
    return {
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "User-Agent": "request"
    }
}


/**
 * **request**
 * 
 * A lightweight wrapper around Javascript's `fetch` utility which is
 * exposed as a higher order function. 
 * 
 * - the first call allows to configure:
 *      - set key/value context information 
 *      - provide an error handler which overrides the default
 *      - provides a callback handler to be called on the requests
 * _finally_ event.
 * - the signature for the second call mimics that of the **fetch** API
 * 
 */
export function request<
    TOpt extends RequestOptions
>(
    opt: TOpt
) {
    return async <
        TInput extends string | URL | globalThis.Request,
        TInit extends RequestInit
    >(
        input: TInput, 
        init?: TInit
    ) => {
        const stack = new Error().stack;
        try {

            if(opt.skipValidation) {
                process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0' 
            }
            
            const res = await fetch(
                input,
                {
                    headers: defaultHeaders(init),
                    ...init
                }
                
            );

            if(isOk(res)) {
                if (opt.response === "json") {
                    return res.json();
                } else if (opt.response === "text") {
                    return res.text();
                } else {
                    return res;
                }
            }
        } catch (err) {
            if(opt.errorHandler) {
                return opt.errorHandler(err as Error);
            } else {
                if(isError(err)) {
                    return defaultErrHandler(opt,input,init)(err);
                } else {
                    if(isObject(err)) {
                        return defaultErrHandler(opt,input,init)({
                            stack,
                            name: "NativeFetch",

                            ...opt
                        })
                    }
                }
            }
        }
    }

}
