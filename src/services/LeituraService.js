const ApiError = require('../utils/ApiError');
const LeituraRequestDTO = require('../dtos/LeituraRequestDTO');
const LeituraResponseDTO = require('../dtos/LeituraResponseDTO');
const LeituraRepository = require('../repositories/LeituraRepository');

class LeituraService {
    constructor(repository = new LeituraRepository()) {
        this.repository = repository;
    }

    async list(query = {}) {
        const page = this.parsePositiveInteger(query.page, 1, 'page');
        const limit = this.parsePositiveInteger(query.limit, 20, 'limit', 100);
        const filters = this.buildFilters(query);

        const result = await this.repository.findAllWithPagination({
            page,
            limit,
            filters
        });

        return {
            data: LeituraResponseDTO.fromMany(result.rows),
            meta: {
                total: result.count,
                page,
                limit,
                totalPages: Math.ceil(result.count / limit)
            }
        };
    }

    async findById(id) {
        const leituraId = this.parseId(id);
        const leitura = await this.repository.findById(leituraId);

        if (!leitura) {
            throw new ApiError('Leitura não encontrada.', 404);
        }

        return LeituraResponseDTO.from(leitura);
    }

    async create(payload) {
        const dto = payload instanceof LeituraRequestDTO
            ? payload
            : new LeituraRequestDTO(payload);
        const data = this.validateAndNormalize(dto);
        const leitura = await this.repository.create(data);

        return LeituraResponseDTO.from(leitura);
    }

    async bulkCreate(dtos = []) {
        const items = dtos.map((item) => {
            const dto = item instanceof LeituraRequestDTO
                ? item
                : new LeituraRequestDTO(item);
            return this.validateAndNormalize(dto);
        });

        const created = await this.repository.bulkCreate(items);

        return {
            count: created.length,
            data: LeituraResponseDTO.fromMany(created)
        };
    }

    async update(id, payload) {
        const leituraId = this.parseId(id);
        const dto = new LeituraRequestDTO(payload);
        const data = this.validateAndNormalize(dto);
        const leitura = await this.repository.update(leituraId, data);

        if (!leitura) {
            throw new ApiError('Leitura não encontrada.', 404);
        }

        return LeituraResponseDTO.from(leitura);
    }

    async deleteById(id) {
        const leituraId = this.parseId(id);
        const deleted = await this.repository.deleteById(leituraId);

        if (deleted === 0) {
            throw new ApiError('Leitura não encontrada.', 404);
        }

        return {
            id: leituraId
        };
    }

    async deleteAll() {
        await this.repository.deleteAll();

        return {
            message: 'Todas as leituras foram excluídas com sucesso.'
        };
    }

    validateAndNormalize(dto) {
        const data = dto.toPlainObject();

        if (!data.station_id || typeof data.station_id !== 'string') {
            throw new ApiError('station_id é obrigatório.', 400);
        }

        if (data.station_id.length > 255) {
            throw new ApiError('station_id deve ter no máximo 255 caracteres.', 400);
        }

        if (!data.timestamp) {
            throw new ApiError('timestamp é obrigatório.', 400);
        }

        // Requer data/hora ISO 8601 com fuso para evitar interpretações ambíguas.
        const match = typeof data.timestamp === 'string'
            ? data.timestamp.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,9})?)?(Z|[+-](\d{2}):(\d{2}))$/)
            : null;

        if (!match || !this.isValidCalendarDate(match[1], match[2], match[3]) ||
            Number(match[4]) > 23 || Number(match[5]) > 59 ||
            Number(match[6] || 0) > 59 || Number(match[8] || 0) > 23 ||
            Number(match[9] || 0) > 59) {
            throw new ApiError('timestamp deve ser uma data e hora ISO 8601 válida, com fuso horário.', 400);
        }

        const parsedDate = new Date(data.timestamp);

        if (Number.isNaN(parsedDate.getTime())) {
            throw new ApiError('timestamp deve ser uma data válida.', 400);
        }

        if (!Number.isFinite(data.temperature_c)) {
            throw new ApiError('temperature_c é obrigatório e deve ser numérico.', 400);
        }

        if (!Number.isFinite(data.humidity_pct)) {
            throw new ApiError('humidity_pct é obrigatório e deve ser numérico.', 400);
        }

        if (data.humidity_pct < 0 || data.humidity_pct > 100) {
            throw new ApiError('humidity_pct deve estar entre 0 e 100.', 400);
        }

        return {
            station_id: data.station_id,
            timestamp: parsedDate,
            temperature_c: data.temperature_c,
            humidity_pct: data.humidity_pct
        };
    }

    buildFilters(query) {
        const filters = {};

        if (query.station_id) {
            filters.station_id = String(query.station_id).trim();
        }

        if (query.data_inicio) {
            filters.data_inicio = this.parseDateFilter(query.data_inicio, 'data_inicio', false);
        }

        if (query.data_fim) {
            filters.data_fim = this.parseDateFilter(query.data_fim, 'data_fim', true);
        }

        if (filters.data_inicio && filters.data_fim && filters.data_inicio > filters.data_fim) {
            throw new ApiError('data_inicio não pode ser maior que data_fim.', 400);
        }

        return filters;
    }

    parseDateFilter(value, fieldName, endOfDay) {
        const rawValue = String(value).trim();
        const onlyDatePattern = /^\d{4}-\d{2}-\d{2}$/;
        const dateMatch = rawValue.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/);

        if (!dateMatch || !this.isValidCalendarDate(dateMatch[1], dateMatch[2], dateMatch[3])) {
            throw new ApiError(`${fieldName} deve ser uma data válida.`, 400);
        }

        const normalizedValue = onlyDatePattern.test(rawValue)
            ? `${rawValue}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z`
            : rawValue;
        const parsedDate = new Date(normalizedValue);

        if (Number.isNaN(parsedDate.getTime())) {
            throw new ApiError(`${fieldName} deve ser uma data válida.`, 400);
        }

        return parsedDate;
    }

    isValidCalendarDate(year, month, day) {
        const y = Number(year);
        const m = Number(month);
        const d = Number(day);
        const date = new Date(Date.UTC(y, m - 1, d));
        return date.getUTCFullYear() === y &&
            date.getUTCMonth() === m - 1 &&
            date.getUTCDate() === d;
    }

    parseId(id) {
        const parsedId = Number(id);

        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            throw new ApiError('id deve ser um número inteiro positivo.', 400);
        }

        return parsedId;
    }

    parsePositiveInteger(value, defaultValue, fieldName, maxValue = null) {
        if (value === undefined || value === null || value === '') {
            return defaultValue;
        }

        const parsed = Number(value);

        if (!Number.isInteger(parsed) || parsed <= 0) {
            throw new ApiError(`${fieldName} deve ser um número inteiro positivo.`, 400);
        }

        if (maxValue && parsed > maxValue) {
            return maxValue;
        }

        return parsed;
    }
}

module.exports = LeituraService;
