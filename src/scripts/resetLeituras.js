require('dotenv').config();

const sequelize = require('../config/database');
const ensureDatabase = require('../config/ensureDatabase');
require('../models/Leitura');
const LeituraService = require('../services/LeituraService');

async function main() {
    const leituraService = new LeituraService();

    try {
        await ensureDatabase();
        await sequelize.authenticate();
        await sequelize.sync();
        await leituraService.deleteAll();

        console.log('Tabela leituras limpa com sucesso. Contador de id reiniciado.');
    } finally {
        await sequelize.close();
    }
}

main().catch(async (error) => {
    console.error('Erro ao limpar tabela leituras:', error.message);

    try {
        await sequelize.close();
    } catch (closeError) {
        // A conexão pode já estar fechada.
    }

    process.exit(1);
});
