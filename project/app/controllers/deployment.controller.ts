import Koa, { Context } from 'koa'
import { DeploymentModel } from '../models/deployment.model';
import ProjectModel from '../models/project.model'
import { WebhookRequestType } from "../types/types";


export default class DeploymentController {
    private model: DeploymentModel

    constructor() {
        this.model = new DeploymentModel()
    }

    /**
     * Get all deployments
     * @param ctx Contains request and response context which includes the query parameters for the request
     */
    getAll = async (ctx: Context) => {
        const params = ctx.request.query
        const size = 8;
        const page = (parseInt((typeof params.page == "object" ? params.page[0] : params.page) ?? "1") - 1);
        if (page < 0) {
            ctx.status = 400
            ctx.body = {
                name: "PageError",
                message: "The page number must be higher than 0"
            }
            return;
        }
        ctx.body = await this.model.getAll(page * size, size)
    }

    /**
     * Get a specific deployment
     * @param ctx Contains request and response context which includes the ID parameter for the request
     */
    getOne = async (ctx: Context) => {
        const data = await this.model.getOne(ctx.params.id)
        if (!data) {
            ctx.status = 404
            ctx.body = {
                name: "IndexError",
                message: "The content you asked for does not exist"
            }
        }
        if (data.length != 0)
            ctx.body = data[0]

    }

    /**
     * Cancel a specific deployment
     * @param ctx Contains request and response context which includes the ID parameter for the request
     */

    cancel = async (ctx: Context) => {
        let response = await this.model.cancel(ctx.params.id)
        if (response && response.length != 0)
            ctx.body = response[0]
        else {
            ctx.status = 404
            ctx.body = {
                name: "BadInput",
                message: "The provided input does not exist"
            }
        }
    }

    /**
     * Handle incoming webhook request
     * @param ctx Contains request and response context which includes the request body
     */
    webhook = async (ctx: Context) => {
        const body = <WebhookRequestType>ctx.request.body;
        if (!body.hasOwnProperty("id") && !body.hasOwnProperty("status")) {
            ctx.status = 401
            ctx.body = {
                name: "BadInput",
                message: "Please provide the id and status fields"
            }
        }

        let response = await this.model.webhook(body)
        if (response && response.length != 0)
            ctx.body = response[0]
        else if (response == false) {
            ctx.status = 404
            ctx.body = {
                name: "BadInput",
                message: "The provided input does not exist"
            }
        }
        else {
            ctx.status = 500
            ctx.body = {
                name: "ServerError",
                message: "An error occured on the server"
            }
        }


    }


}