/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('deployments', function (table) {
            table.increments('id');
            table.integer('deployed_in').nullable();
            table.enum('status', ["pending", "building", "deploying", "failed", "cancelled", "done"]).notNullable();
            table.integer('project_id').unsigned()
            table.foreign('project_id')
                .references('projects.id')
                .withKeyName('fk_fkey_project');
            table.datetime('created_at').notNullable();
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTable("deployments")
};
