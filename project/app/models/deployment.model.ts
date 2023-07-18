import { Knex } from "knex";
import Model from "./model";
import { Status, WebhookRequestType } from "../types/types";
import { generateRandomUrl } from "../utils/utils";




export class DeploymentModel extends Model {

    // deployment status const

    private PENDING_STATUS: Status = "pending"
    private DEPLOYING_STATUS: Status = "deploying"
    private BUILDING_STATUS: Status = "building"
    private FAILED_STATUS: Status = "failed"
    private CANCELED_STATUS: Status = "cancelled"
    private DONE_STATUS: Status = "done"


    constructor() {
        super()
    }

    private selectDeployments = (size: number) => {
        return this.db.select(
            "id",
            "deployed_in as deployedIn",
            "status",
            "created_at as createdAt"
        ).from(this.deploymentTableName).limit(size)
    }

    /**
    * Method to get all deployments with limit and offset for pagination
    * @param offset Starting point in the list of records
    * @param size Number of records to return
    * @returns An array of Deployment objects
    */
    getAll(offset: number, size: number) {
        return this.selectDeployments(size).offset(offset);
    }

    /**
    * Method to create a deployment
    * @param id The ID of the project for which the deployment is being created
    * @returns The created Deployment object
    */
    createDeploment = async (id: string) => {
        const returned_id = await this.db(this.deploymentTableName).insert({
            status: this.PENDING_STATUS,
            project_id: id,
            deployed_in: 0,
            created_at: new Date()
        }).returning('id')
        if (!returned_id)
            throw Error("Error while creating the deployment")
        return this.getOne(returned_id[0].id)
    }

    /**
     * Method to get a single deployment by its ID
     * @param id The ID of the deployment to retrieve
     * @returns The requested Deployment object
     */
    getOne(id: number) {
        return this.selectDeployments(1).where("id", id);

    }

    /**
     * Method to cancel a deployment by updating its status to 'cancelled'
     * @param id The ID of the deployment to cancel
     * @returns The updated Deployment object if the deployment was found and updated, or false otherwise
     */
    cancel = async (id: string) => {

        const returned_id = await this.db(this.deploymentTableName).where("id", id).update({
            status: this.CANCELED_STATUS,
        }).returning('id')
        if (!returned_id || returned_id.length == 0)
            return false
        return this.getOne(returned_id[0].id)

    }

    /**
     * Method to update a deployment based on incoming webhook data
     * @param body An object containing the ID and new status of the deployment
     * @returns The updated Deployment object if the deployment was found and updated, or false otherwise
     */

    webhook = async (body: WebhookRequestType) => {

        let update_table: {
            status: Status;
            deployed_in?: Knex.Raw<any>
        } = {
            status: body.status,
        };
        if (body.status == this.DONE_STATUS)
            update_table.deployed_in = this.db.raw(`CASE 
            WHEN status != '${this.DONE_STATUS}' THEN EXTRACT(EPOCH FROM (NOW() - created_at))
            ELSE deployed_in
            END`);

        const returned_id = await this.db(this.deploymentTableName).where("id", body.id).update(update_table).returning('*')
        if (!returned_id || returned_id.length == 0)
            return false

        // Updating projects
        let database = this.db
        await this.db(this.projectTableName).where('id', returned_id[0].project_id).andWhere('url', null)
            .andWhere(function () {
                this.whereExists(
                    database.select(1)
                        .from("deployments")
                        .where('project_id', returned_id[0].project_id)
                        .andWhere('status', 'done')
                );
            })
            .update({ url: generateRandomUrl() })

        return this.getOne(returned_id[0].id)


    }

}