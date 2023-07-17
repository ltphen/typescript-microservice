// Update with your config settings.

import dotenv from "dotenv"

dotenv.config()
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {

  development: {
    client: 'postgresql',
    connection: process.env.DATABASE_URI,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations'

    },
    seeds: {
      directory: './db/seeds'
    }
  },

  staging: {
    client: 'postgresql',
    connection: process.env.DATABASE_URI,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations'

    },
    seeds: {
      directory: './db/seeds'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URI,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations'

    },
    seeds: {
      directory: './db/seeds'
    }

  }

};
