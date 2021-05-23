import { Knex } from "knex";

export async function up(knex: Knex) {
    return knex.schema.createTable("request_item", (table) => {
        table.increments("id").primary();
        table
            .integer("material_id")
            .notNullable()
            .references("id")
            .inTable("material")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
        table
            .integer("solicitation_id")
            .notNullable()
            .references("id")
            .inTable("solicitation")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
        table.integer("amount").notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable("request_item");
}
