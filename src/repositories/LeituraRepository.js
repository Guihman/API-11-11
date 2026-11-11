const { Op } = require('sequelize');
const Leitura = require('../models/Leitura');

class LeituraRepository {
    async findAllWithPagination({ page, limit, filters = {} }) {
        const where = {};

        if (filters.station_id) {
            where.station_id = filters.station_id;
        }

        if (filters.data_inicio && filters.data_fim) {
            where.timestamp = {
                [Op.between]: [filters.data_inicio, filters.data_fim]
            };
        } else if (filters.data_inicio) {
            where.timestamp = {
                [Op.gte]: filters.data_inicio
            };
        } else if (filters.data_fim) {
            where.timestamp = {
                [Op.lte]: filters.data_fim
            };
        }

        return Leitura.findAndCountAll({
            where,
            offset: (page - 1) * limit,
            limit,
            order: [['timestamp', 'ASC'], ['id', 'ASC']]
        });
    }

    async findById(id) {
        return Leitura.findByPk(id);
    }

    async create(data) {
        return Leitura.create(data);
    }

    async bulkCreate(items) {
        return Leitura.bulkCreate(items, {
            validate: true,
            returning: true
        });
    }

    async update(id, data) {
        const leitura = await Leitura.findByPk(id);

        if (!leitura) {
            return null;
        }

        return leitura.update(data);
    }

    async deleteById(id) {
        return Leitura.destroy({
            where: { id }
        });
    }

    async deleteAll() {
        await Leitura.destroy({
            where: {},
            truncate: true,
            restartIdentity: true
        });
    }
}

module.exports = LeituraRepository;
