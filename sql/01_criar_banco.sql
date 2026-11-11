-- Execute este arquivo conectado ao banco de manutenção "postgres".
-- O comando \gexec é um recurso do psql.
SELECT 'CREATE DATABASE db_em'
WHERE NOT EXISTS (
    SELECT 1
    FROM pg_database
    WHERE datname = 'db_em'
)
\gexec
