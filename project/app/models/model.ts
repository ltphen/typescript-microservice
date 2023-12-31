import { Knex } from "knex";
import database from "../config/database";

export default class Model {

    protected db: Knex;
    protected projectTableName: string;
    protected deploymentTableName: string;

    constructor() {
        this.db = database;
        this.projectTableName = "projects"
        this.deploymentTableName = "deployments"
    }
}