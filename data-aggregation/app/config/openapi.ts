import { oas } from 'koa-oas3';
import config from "./dotenv"
export const getConfig = async () => {
    return await oas({
        file: `${__dirname}${config.nodeEnv == "development" ? "/../.." : "/.."}/project-api.yaml`,
        endpoint: '/openapi.json',
        uiEndpoint: '/api/docs'
    })
}