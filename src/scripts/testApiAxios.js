require('dotenv').config();

const axios = require('axios');

const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

async function main() {
    console.log(`Testando API em: ${baseUrl}`);

    const health = await axios.get(`${baseUrl}/api/health`);
    console.log('GET /api/health');
    console.log(health.data);

    const list = await axios.get(`${baseUrl}/api/leituras?page=1&limit=5`);
    console.log('GET /api/leituras?page=1&limit=5');
    console.log(list.data);

    const create = await axios.post(`${baseUrl}/api/leituras`, {
        station_id: 'EM-TESTE-AXIOS-01',
        timestamp: '2026-06-01T08:00:00-03:00',
        temperature_c: 26.7,
        humidity_pct: 72.4
    });
    console.log('POST /api/leituras');
    console.log(create.data);

    const createdId = create.data.data.id;
    const findById = await axios.get(`${baseUrl}/api/leituras/${createdId}`);
    console.log(`GET /api/leituras/${createdId}`);
    console.log(findById.data);
}

main().catch((error) => {
    if (error.response) {
        console.error('Erro retornado pela API:', error.response.status, error.response.data);
    } else {
        console.error('Erro ao testar API:', error.message);
    }

    process.exit(1);
});
