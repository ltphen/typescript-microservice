import config from "../config/dotenv";



/**
 * Generates a random URL using the application host and port defined in the environment configuration.
 * The URL consists of a randomly generated path appended to the base URL of the application.
 * @returns The generated URL as a string.
 */
export const generateRandomUrl = (): string => {
    let randomPath = Math.random().toString(36).substring(2);
    let url = config.appHost + ":" + config.port + "/" + randomPath;
    return url;
}

/**
 * Wraps a function with logic to ensure it can only be called once.
 * After the first call, subsequent calls will return the result of the first call without invoking the function again.
 * @param func The function to be wrapped.
 * @returns The wrapped function.
 */
export default function once<T extends (...args: any[]) => any>(func: T): T {
    const _f: any = function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        if (!_f.isCalled) {
            _f.isCalled = true;
            _f.res = func.apply(this, args);
        }
        return _f.res;
    };

    _f.prototype = func.prototype;
    _f.isCalled = false;

    return _f as T;
}