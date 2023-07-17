import config from "./dotenv";
import knex from "knex";

export default knex({
    client: 'pg',
    connection: config.databaseURL,
    searchPath: ['knex', 'public'],
});