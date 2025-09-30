import { isKindError } from "@yankeeinlondon/kind-error";

type Ok<T> = T extends Response
    ? Exclude<T, Error> & { 
            ok: true; 
            json: Promise<any>; 
            text: Promise<any>; 
            status: number;
        }
    : Exclude<T,Error> extends Response
        ? Exclude<T, Error> & { 
                ok: true; 
                json: Promise<any>; 
                text: Promise<any>; 
                status: number;
            }
        :  Exclude<T,Error>;

export function isOk<T>(val: T): val is Ok<T> {
    return val instanceof Error === false || !isKindError(val) || (
        val instanceof Response && val["ok"] === true
    );
}
