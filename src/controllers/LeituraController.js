const LeituraService = require('../services/LeituraService');

const leituraService = new LeituraService();

class LeituraController {
    async list(req, res, next) {
        try {
            const result = await leituraService.list(req.query);
            return res.status(200).json(result);
        } catch (error) {
            return next(error);
        }
    }

    async findById(req, res, next) {
        try {
            const leitura = await leituraService.findById(req.params.id);
            return res.status(200).json({
                success: true,
                data: leitura
            });
        } catch (error) {
            return next(error);
        }
    }

    async create(req, res, next) {
        try {
            const leitura = await leituraService.create(req.body);
            return res.status(201).json({
                success: true,
                message: 'Leitura criada com sucesso.',
                data: leitura
            });
        } catch (error) {
            return next(error);
        }
    }

    async update(req, res, next) {
        try {
            const leitura = await leituraService.update(req.params.id, req.body);
            return res.status(200).json({
                success: true,
                message: 'Leitura atualizada com sucesso.',
                data: leitura
            });
        } catch (error) {
            return next(error);
        }
    }

    async deleteById(req, res, next) {
        try {
            const result = await leituraService.deleteById(req.params.id);
            return res.status(200).json({
                success: true,
                message: 'Leitura excluída com sucesso.',
                data: result
            });
        } catch (error) {
            return next(error);
        }
    }

    async deleteAll(req, res, next) {
        try {
            const result = await leituraService.deleteAll();
            return res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = new LeituraController();
