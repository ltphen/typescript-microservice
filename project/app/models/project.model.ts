import { Knex } from "knex";
import Model from "./model";


export default class ProjectModel extends Model {

    constructor() {
        super()
    }

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

    getAll(offset: number, size: number) {
        return this.selectProject(size).offset(offset);
    }

    getOne(id: string) {
        return this.selectProject(1).where("id", id);
    }

}