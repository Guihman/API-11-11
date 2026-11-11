const express = require('express');
const leituraRoutes = require('./leituraRoutes');

const router = express.Router();

router.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Resumo das rotas disponíveis na API.',
        routes: {
            health: 'GET /api/health',
            leituras: {
                list: 'GET /api/leituras?page=1&limit=20',
                findById: 'GET /api/leituras/:id',
                create: 'POST /api/leituras',
                update: 'PUT /api/leituras/:id',
                deleteById: 'DELETE /api/leituras/:id',
                deleteAll: 'DELETE /api/leituras'
            }
        }
    });
});

router.get('/health', (req, res) => {
    return res.status(200).json({
        success: true,
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

router.use('/leituras', leituraRoutes);

module.exports = router;
