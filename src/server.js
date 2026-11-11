require('dotenv').config();

const app = require('./app');
const sequelize = require('./config/database');
const ensureDatabase = require('./config/ensureDatabase');
require('./models/Leitura');

async function startServer() {
    const port = Number(process.env.PORT || 3000);

    try {
        await ensureDatabase();
        await sequelize.authenticate();
        await sequelize.sync();

        app.listen(port, () => {
            console.log(`API backend-base-em executando em http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar a aplicação:', error.message);
        process.exit(1);
    }
}

startServer();
