import { Knex } from "knex";

export async function up(knex: Knex) {
    return knex.schema.createTable("solicitation", (table) => {
        table.increments("id").primary();
        table.integer("solicitationNumber").notNullable();
        table
            .date("issueDate")
            .notNullable()
            .defaultTo(new Date().toISOString().split("T")[0]);
        table.string("requesterName").notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable("solicitation");
}
