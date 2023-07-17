import { DeploymentModel } from './../models/deployment.model';
import ProjectModel from './../models/project.model'
import Koa, { Context } from 'koa'

import { strict as assert } from 'node:assert';

export default class ProjectController {
    private model: ProjectModel
    private deploymentModel: DeploymentModel;

    constructor() {
        this.model = new ProjectModel()
        this.deploymentModel = new DeploymentModel()
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
        if (!data || data.length == 0) {
            ctx.status = 404
            ctx.body = {
                name: "IndexError",
                message: "The content you asked for does not exist"
            }
            return;
        }
        if (data.length != 0)
            ctx.body = data[0]
    }

    getDeployments = async (ctx: Context) => {
        let response = await this.deploymentModel.createDeploment(ctx.params.id)

        if (response && response.length != 0)
            ctx.body = response[0]

    }


}