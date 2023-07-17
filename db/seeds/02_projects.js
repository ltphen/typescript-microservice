/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const data = require("../../projects.json")

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('projects').insert(data);
};
