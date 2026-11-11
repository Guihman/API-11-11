const ApiError = require('../utils/ApiError');

function notFoundHandler(req, res, next) {
    return next(new ApiError(`Rota não encontrada: ${req.method} ${req.originalUrl}`, 404));
}

module.exports = notFoundHandler;
