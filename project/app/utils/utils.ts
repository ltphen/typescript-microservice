import config from "../config/dotenv";

export const generateRandomUrl = (): string => {
    let randomPath = Math.random().toString(36).substring(2);
    let url = config.appHost + ":" + config.port + "/" + randomPath;
    return url;
}