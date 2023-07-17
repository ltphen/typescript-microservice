/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('projects', function (table) {
            table.increments('id');
            table.string('name', 255).notNullable();
            table.string('url', 255).nullable();
            table.string('app_secret', 255).notNullable();
            table.integer('user_id').unsigned()
            table.foreign('userId')
                .references('users.id')
                .withKeyName('fk_fkey_users');
            table.datetime('created_at').notNullable();
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTable("projects")
};
