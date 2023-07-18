import { oas } from 'koa-oas3';
import config from "./dotenv"

// This is the middleware that help to parse de documentation and provide a nice UI to test the API with
export const getConfig = async () => {
    return await oas({
        file: `${__dirname}${config.nodeEnv == "development" ? "/../.." : "/.."}/project-api.yaml`,
        endpoint: '/openapi.json',
        uiEndpoint: '/api/docs'
    })
}