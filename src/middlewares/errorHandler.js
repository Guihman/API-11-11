const ApiError = require('../utils/ApiError');

function errorHandler(error, req, res, next) {
    const invalidJson = error.type === 'entity.parse.failed' && error.status === 400;
    const isExpectedError = error instanceof ApiError || error.isOperational || invalidJson;
    const statusCode = invalidJson ? 400 : isExpectedError ? error.statusCode : 500;
    const message = invalidJson
        ? 'Corpo JSON inválido.'
        : isExpectedError ? error.message : 'Erro interno inesperado.';

    if (!isExpectedError) {
        console.error(error);
    }

    return res.status(statusCode).json({
        success: false,
        message
    });
}

module.exports = errorHandler;
