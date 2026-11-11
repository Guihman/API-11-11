const parseNumber = require('../utils/parseNumber');

class LeituraRequestDTO {
    constructor(payload = {}) {
        const input = payload && typeof payload === 'object' && !Array.isArray(payload)
            ? payload
            : {};

        this.station_id = typeof input.station_id === 'string'
            ? input.station_id.trim()
            : input.station_id;
        this.timestamp = input.timestamp;
        this.temperature_c = parseNumber(input.temperature_c);
        this.humidity_pct = parseNumber(input.humidity_pct);
    }

    toPlainObject() {
        return {
            station_id: this.station_id,
            timestamp: this.timestamp,
            temperature_c: this.temperature_c,
            humidity_pct: this.humidity_pct
        };
    }
}

module.exports = LeituraRequestDTO;
