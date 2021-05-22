import { Knex } from 'knex'

export async function up(knex: Knex) {
    return knex.schema.createTable('material', table => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.integer('code').notNullable().unique()
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('material')
}