class LeituraResponseDTO {
    constructor(leitura) {
        const plain = leitura && typeof leitura.get === 'function'
            ? leitura.get({ plain: true })
            : leitura;

        this.id = plain.id;
        this.station_id = plain.station_id;
        this.timestamp = plain.timestamp instanceof Date
            ? plain.timestamp.toISOString()
            : new Date(plain.timestamp).toISOString();
        this.temperature_c = Number(plain.temperature_c);
        this.humidity_pct = Number(plain.humidity_pct);
    }

    static from(leitura) {
        return new LeituraResponseDTO(leitura);
    }

    static fromMany(leituras = []) {
        return leituras.map((leitura) => new LeituraResponseDTO(leitura));
    }
}

module.exports = LeituraResponseDTO;
