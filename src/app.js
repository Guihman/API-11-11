const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const notFoundHandler = require('./middlewares/notFoundHandler');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'API backend-base-em em execução.',
        description: 'API RESTful em n-camadas para leituras ambientais com Node.js, Express, PostgreSQL e Sequelize.',
        database: process.env.DB_NAME || 'db_em',
        mainRoutes: [
            'GET /',
            'GET /api',
            'GET /api/health',
            'GET /api/leituras',
            'GET /api/leituras/:id',
            'POST /api/leituras',
            'PUT /api/leituras/:id',
            'DELETE /api/leituras/:id',
            'DELETE /api/leituras'
        ]
    });
});

app.use('/api', routes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
