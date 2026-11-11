function parseNumber(value) {
    if (typeof value === 'number') {
        return value;
    }

    if (typeof value === 'string') {
        const normalized = value.trim().replace(',', '.');

        if (normalized === '') {
            return NaN;
        }

        return Number(normalized);
    }

    return NaN;
}

module.exports = parseNumber;
