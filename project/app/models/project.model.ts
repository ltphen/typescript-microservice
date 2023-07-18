import { Knex } from "knex";
import Model from "./model";


export default class ProjectModel extends Model {

    constructor() {
        super()
    }

    /**
    * Method to select project records from the database with a limit.
    * This method also includes additional fields 'hasOngoingDeployment' and 'hasLiveDeployment'
    * which denote if a project has any ongoing or live deployments, respectively.
    * @param size Number of records to return
    * @returns A QueryBuilder instance that can be used to further modify the query
    */
    private selectProject = (size: number) => {
        return this.db.select(
            "id",
            "name",
            "url",
            this.db.raw(`CASE 
            WHEN EXISTS (
                SELECT 1 
                FROM ${this.deploymentTableName} 
                WHERE ${this.deploymentTableName}.project_id = ${this.projectTableName}.id AND (${this.deploymentTableName}.status = 'pending' OR ${this.deploymentTableName}.status = 'building' OR ${this.deploymentTableName}.status = 'deploying')
            ) THEN true 
            ELSE false 
            END AS "hasOngoingDeployment"`),
            this.db.raw(`CASE 
            WHEN EXISTS (
                SELECT 1 
                FROM ${this.deploymentTableName} 
                WHERE ${this.deploymentTableName}.project_id = ${this.projectTableName}.id AND ${this.deploymentTableName}.status = 'done'
            ) THEN true 
            ELSE false 
            END AS "hasLiveDeployment"`)
        ).orderBy('id').from(this.projectTableName).limit(size)
    }

    /**
     * Method to get all projects with limit and offset for pagination
     * @param offset Starting point in the list of records
     * @param size Number of records to return
     * @returns An array of Project objects
     */

    getAll(offset: number, size: number) {
        return this.selectProject(size).offset(offset);
    }

    /**
     * Method to get a single project by its ID
     * @param id The ID of the project to retrieve
     * @returns The requested Project object
     */

    getOne(id: string) {
        return this.selectProject(1).where("id", id);
    }

}