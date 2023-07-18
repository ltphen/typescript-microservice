import { Knex } from "knex";
import database from "../config/database";

export default class Model {

    protected db: Knex;
    protected tablename: string;

    constructor() {
        this.db = database;
        this.tablename = "events"
    }
}