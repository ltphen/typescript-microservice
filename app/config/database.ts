import config from "./dotenv";
import knex from "knex";
import knexconfig from "./../../knexfile";
export default knex(config.nodeEnv == "development" ? knexconfig.development : knexconfig.production);