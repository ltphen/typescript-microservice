import { oas } from 'koa-oas3';

export const getConfig = async ()=>{
    return await oas({
        file: `${__dirname}/../../project-api.yaml`,
        endpoint: '/openapi.json',
        uiEndpoint: '/api/docs'
    })
}