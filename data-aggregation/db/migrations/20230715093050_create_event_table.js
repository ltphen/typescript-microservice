/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('events', function (table) {
            table.increments('id');
            table.string('name', 255).notNullable();
            table.json('payload').notNullable();
            table.datetime('created_at').notNullable();

        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTable("events");
};
