/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const data = require("../../users.json")

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('deployments').del()
  await knex('projects').del()
  await knex('users').del()
  await knex('users').insert(data);
};
