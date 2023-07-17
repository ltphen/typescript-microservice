import Koa, { Context } from 'koa'
import { DeploymentModel } from './../models/deployment.model';
import ProjectModel from './../models/project.model'
import { WebhookRequestType } from "./../types/types";


export default class DeploymentController {
    private model: DeploymentModel

    constructor() {
        this.model = new DeploymentModel()
    }


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

    getOne = async (ctx: Context) => {
        const data = await this.model.getOne(ctx.params.id)
        if (!data) {
            ctx.status = 404
            ctx.body = {
                name: "IndexError",
                message: "The content you asked for does not exist"
            }
        }
        ctx.body = data

    }

    cancel = async (ctx: Context) => {
        ctx.body = await this.model.cancel(ctx.params.id)

    }

    webhook = async (ctx: Context) => {
        const body = <WebhookRequestType>ctx.request.body;
        ctx.body = await this.model.webhook(body)

    }


}