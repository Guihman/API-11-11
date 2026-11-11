const { Client } = require('pg');
require('dotenv').config();

function quoteIdentifier(identifier) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)) {
        throw new Error(`Nome de banco inválido: ${identifier}`);
    }

    return `"${identifier.replace(/"/g, '""')}"`;
}

async function ensureDatabase() {
    const dbName = process.env.DB_NAME || 'db_em';

    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        database: process.env.DB_MAINTENANCE_NAME || 'postgres',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres'
    });

    await client.connect();

    try {
        console.log(`Verificando se o banco "${dbName}" existe...`);

        const result = await client.query(
            'SELECT 1 FROM pg_database WHERE datname = $1',
            [dbName]
        );

        if (result.rowCount === 0) {
            console.log(`Banco "${dbName}" não existe. Criando banco...`);
            await client.query(`CREATE DATABASE ${quoteIdentifier(dbName)}`);
            console.log(`Banco "${dbName}" criado com sucesso.`);
        } else {
            console.log(`Banco "${dbName}" já existe.`);
        }
    } finally {
        await client.end();
    }
}

module.exports = ensureDatabase;
