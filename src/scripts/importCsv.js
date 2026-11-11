require('dotenv').config();

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const sequelize = require('../config/database');
const ensureDatabase = require('../config/ensureDatabase');
require('../models/Leitura');
const LeituraRequestDTO = require('../dtos/LeituraRequestDTO');
const LeituraService = require('../services/LeituraService');

function readCsvFile(csvPath) {
    return new Promise((resolve, reject) => {
        const rows = [];

        const fileStream = fs.createReadStream(csvPath);
        fileStream.on('error', reject);

        fileStream.pipe(csv())
            .on('data', (row) => rows.push(row))
            .on('end', () => resolve(rows))
            .on('error', (error) => reject(error));
    });
}

async function main() {
    const clearBeforeImport = process.argv.includes('--clear');
    const csvPath = path.resolve(__dirname, '../../data/em.csv');
    const leituraService = new LeituraService();

    if (!fs.existsSync(csvPath)) {
        throw new Error(`Arquivo CSV não encontrado em: ${csvPath}`);
    }

    try {
        await ensureDatabase();
        await sequelize.authenticate();
        await sequelize.sync();

        const rows = await readCsvFile(csvPath);
        const dtos = rows.map((row) => new LeituraRequestDTO(row));

        if (rows.length === 0) {
            throw new Error('O arquivo CSV está vazio. Nenhum registro foi alterado.');
        }

        // Valida todas as linhas antes de qualquer exclusão de dados.
        dtos.forEach((dto) => leituraService.validateAndNormalize(dto));

        if (clearBeforeImport) {
            await leituraService.deleteAll();
            console.log('Tabela leituras limpa antes da importação.');
        }

        const result = await leituraService.bulkCreate(dtos);

        console.log(`Importação concluída com sucesso. Total importado: ${result.count}`);
    } finally {
        await sequelize.close();
    }
}

main().catch(async (error) => {
    console.error('Erro ao importar CSV:', error.message);

    try {
        await sequelize.close();
    } catch (closeError) {
        // A conexão pode já estar fechada.
    }

    process.exit(1);
});
