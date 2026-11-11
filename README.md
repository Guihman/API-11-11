# backend-base-em

API RESTful em arquitetura de n-camadas usando Node.js, Express, PostgreSQL e Sequelize ORM.

O projeto trabalha com leituras ambientais armazenadas na tabela `public.leituras`, contendo estação, data/hora, temperatura e umidade.

## 1. O que o projeto faz

Este projeto cria uma API para:

- cadastrar leituras ambientais;
- listar leituras com paginação;
- filtrar por estação e período;
- buscar leitura por ID;
- atualizar leitura;
- excluir uma leitura;
- excluir todas as leituras;
- importar dados a partir de arquivo CSV;
- testar a API com Axios;
- criar automaticamente o banco `db_em` caso ele ainda não exista.

## 2. O que é uma API RESTful

Uma API RESTful é uma interface de comunicação entre sistemas usando o protocolo HTTP.

Neste projeto, usamos rotas como:

- `GET` para consultar dados;
- `POST` para criar dados;
- `PUT` para atualizar dados;
- `DELETE` para excluir dados.

A API recebe e devolve dados no formato JSON.

## 3. O que é arquitetura em n-camadas

A arquitetura em n-camadas organiza o projeto em partes com responsabilidades separadas.

Em vez de colocar tudo em um único arquivo, o código é dividido em camadas como Routes, Controller, Service, DTO, Repository, Model e Config.

Isso facilita:

- manutenção;
- leitura do código;
- testes;
- evolução do projeto;
- reutilização de regras;
- separação entre regra de negócio e acesso ao banco.

## 4. Raio-x da estrutura de pastas

```text
backend-base-em/
├── data/
│   └── em.csv
├── scripts/
│   ├── linux/
│   └── windows/
├── sql/
│   ├── 01_criar_banco.sql
│   └── 02_criar_tabela.sql
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── dtos/
│   ├── middlewares/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   └── utils/
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── requests.http
```

### `data/`

Guarda o arquivo CSV usado para popular a tabela `leituras`.

### `scripts/linux/` e `scripts/windows/`

Contém scripts prontos para executar comandos comuns no Linux e no Windows.

### `sql/`

Contém scripts SQL de apoio para criação do banco e da tabela.

### `src/config/`

Responsável pela configuração do banco e pela criação automática do banco `db_em`.

### `src/routes/`

Define os caminhos HTTP da API.

### `src/controllers/`

Recebe `req`, `res` e `next`, chama a camada Service e devolve a resposta HTTP.

### `src/dtos/`

Controla o formato de entrada e saída dos dados.

### `src/services/`

Contém regras de negócio, validações principais e chamadas ao Repository.

### `src/repositories/`

Acessa o banco de dados usando Sequelize.

### `src/models/`

Representa a tabela `public.leituras` no Sequelize.

### `src/middlewares/`

Centraliza tratamento de erros e rotas inexistentes.

### `src/scripts/`

Contém scripts em Node.js para importar CSV, limpar tabela e testar API.

### `src/utils/`

Contém funções e classes utilitárias.

## 5. Comunicação entre as camadas

Fluxo de entrada:

```text
Cliente HTTP
→ Routes
→ Controller
→ Service
→ DTO
→ Repository
→ Model
→ PostgreSQL
```

Fluxo de retorno:

```text
PostgreSQL
→ Model
→ Repository
→ Service
→ DTO de resposta
→ Controller
→ Cliente HTTP
```

## 6. Requisitos para rodar o projeto

Você precisa ter instalado:

- Node.js;
- npm;
- PostgreSQL;
- editor de código, como VS Code;
- ferramenta de teste de API, como Postman, Insomnia ou extensão REST Client.

## 7. Como instalar o Node.js

Acesse o site oficial do Node.js, baixe a versão LTS e instale normalmente.

Depois teste no terminal:

```bash
node -v
npm -v
```

## 8. Como preparar o PostgreSQL

Tenha o PostgreSQL instalado e com o serviço em execução.

Por padrão, este projeto usa:

```text
host: localhost
porta: 5432
usuário: postgres
senha: postgres
banco principal: db_em
banco de manutenção: postgres
```

Caso sua senha seja diferente, ajuste o arquivo `.env`.

O projeto cria automaticamente o banco `db_em` se ele ainda não existir.

## 9. Como criar o arquivo .env

Copie o arquivo `.env.example` para `.env`.

Linux:

```bash
cp .env.example .env
```

Windows CMD:

```bat
copy .env.example .env
```

Conteúdo esperado:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=db_em
DB_MAINTENANCE_NAME=postgres
DB_USER=postgres
DB_PASSWORD=postgres
NODE_ENV=development
```

## 10. Como instalar dependências

```bash
npm install
```

Ou pelos scripts:

Linux:

```bash
./scripts/linux/install.sh
```

Windows:

```bat
scripts\windows\install.bat
```

## 11. Como iniciar a API

Modo normal:

```bash
npm start
```

Modo desenvolvimento:

```bash
npm run dev
```

Ao iniciar, a aplicação irá:

1. carregar as variáveis do `.env`;
2. verificar se o banco `db_em` existe;
3. criar o banco se necessário;
4. conectar no PostgreSQL;
5. sincronizar o model com `sequelize.sync()`;
6. subir o servidor Express.

## 12. Como importar o CSV

O arquivo usado na importação está em:

```text
data/em.csv
```

Comando:

```bash
npm run import:csv
```

Esse comando importa os dados sem limpar a tabela antes.

## 13. Como limpar e importar novamente

```bash
npm run import:csv:clear
```

Esse comando limpa a tabela `leituras`, reinicia o contador do `id` e importa novamente o CSV.

## 14. Como limpar a tabela

```bash
npm run reset:leituras
```

## 15. Como testar no navegador

Com a API em execução, acesse:

```text
http://localhost:3000/
http://localhost:3000/api
http://localhost:3000/api/health
http://localhost:3000/api/leituras?page=1&limit=5
```

## 16. Como testar usando requests.http

Abra o arquivo `requests.http` no VS Code com a extensão REST Client instalada.

Depois clique em `Send Request` acima de cada requisição.

## 17. Como testar usando Postman ou Insomnia

Use a URL base:

```text
http://localhost:3000
```

Exemplo de POST:

```http
POST /api/leituras
Content-Type: application/json
```

Corpo:

```json
{
  "station_id": "EM-TESTE-01",
  "timestamp": "2026-06-01T08:00:00-03:00",
  "temperature_c": 26.7,
  "humidity_pct": 72.4
}
```

## 18. Como testar com Axios

Com a API em execução, rode:

```bash
npm run test:api
```

O script executa:

1. `GET /api/health`;
2. `GET /api/leituras?page=1&limit=5`;
3. `POST /api/leituras`;
4. `GET /api/leituras/:id`.

## 19. Rotas da API

### GET /

Retorna mensagem informando que a API está em execução.

### GET /api

Retorna resumo das rotas disponíveis.

### GET /api/health

Retorna status da API.

### GET /api/leituras

Lista leituras com paginação e filtros opcionais.

Parâmetros:

```text
page
limit
station_id
data_inicio
data_fim
```

Exemplo:

```text
/api/leituras?page=1&limit=5
```

### GET /api/leituras/:id

Busca uma leitura por ID.

### POST /api/leituras

Cria uma leitura.

### PUT /api/leituras/:id

Atualiza uma leitura existente.

### DELETE /api/leituras/:id

Exclui uma leitura específica.

### DELETE /api/leituras

Exclui todas as leituras. Essa rota existe para facilitar uso em laboratório.

## 20. Scripts npm

```json
{
  "start": "node src/server.js",
  "dev": "nodemon src/server.js",
  "import:csv": "node src/scripts/importCsv.js",
  "import:csv:clear": "node src/scripts/importCsv.js --clear",
  "reset:leituras": "node src/scripts/resetLeituras.js",
  "test:api": "node src/scripts/testApiAxios.js"
}
```

## 21. Comandos úteis para Windows

Instalar:

```bat
scripts\windows\install.bat
```

Iniciar:

```bat
scripts\windows\start.bat
```

Desenvolvimento:

```bat
scripts\windows\dev.bat
```

Importar CSV:

```bat
scripts\windows\import_csv.bat
```

Limpar e importar CSV:

```bat
scripts\windows\import_csv_limpo.bat
```

Limpar tabela:

```bat
scripts\windows\reset_leituras.bat
```

Testar API:

```bat
scripts\windows\test_api_axios.bat
```

## 22. Comandos úteis para Linux

Dar permissão aos scripts, se necessário:

```bash
chmod +x scripts/linux/*.sh
```

Instalar:

```bash
./scripts/linux/install.sh
```

Iniciar:

```bash
./scripts/linux/start.sh
```

Desenvolvimento:

```bash
./scripts/linux/dev.sh
```

Importar CSV:

```bash
./scripts/linux/import_csv.sh
```

Limpar e importar CSV:

```bash
./scripts/linux/import_csv_limpo.sh
```

Limpar tabela:

```bash
./scripts/linux/reset_leituras.sh
```

Testar API:

```bash
./scripts/linux/test_api_axios.sh
```

## 23. Exemplos de SELECT no PostgreSQL

Listar tudo:

```sql
SELECT *
FROM public.leituras
ORDER BY "timestamp";
```

Contar registros:

```sql
SELECT COUNT(*) AS total
FROM public.leituras;
```

Filtrar por estação:

```sql
SELECT *
FROM public.leituras
WHERE station_id = 'EM-ARACATUBA-01'
ORDER BY "timestamp";
```

Filtrar por período:

```sql
SELECT *
FROM public.leituras
WHERE "timestamp" BETWEEN '2026-01-01' AND '2026-01-03 23:59:59'
ORDER BY "timestamp";
```

Temperatura média por estação:

```sql
SELECT
    station_id,
    ROUND(AVG(temperature_c)::numeric, 2) AS temperatura_media
FROM public.leituras
GROUP BY station_id
ORDER BY station_id;
```

Umidade média por estação:

```sql
SELECT
    station_id,
    ROUND(AVG(humidity_pct)::numeric, 2) AS umidade_media
FROM public.leituras
GROUP BY station_id
ORDER BY station_id;
```

## 24. Exemplos de conexão com Power BI

No Power BI Desktop:

1. clique em `Obter dados`;
2. escolha `Banco de dados PostgreSQL`;
3. informe o servidor `localhost`;
4. informe o banco `db_em`;
5. selecione a tabela `public.leituras`;
6. carregue os dados.

Caso o Power BI peça o conector do PostgreSQL, instale o driver Npgsql indicado pelo próprio Power BI.

## 25. Gráficos por faixa de temperatura e umidade

Você pode criar faixas por SQL ou no Power BI.

### Faixa de temperatura em SQL

```sql
SELECT
    CASE
        WHEN temperature_c < 25 THEN 'Abaixo de 25°C'
        WHEN temperature_c >= 25 AND temperature_c < 28 THEN '25°C a 27,9°C'
        WHEN temperature_c >= 28 AND temperature_c < 31 THEN '28°C a 30,9°C'
        ELSE '31°C ou mais'
    END AS faixa_temperatura,
    COUNT(*) AS total
FROM public.leituras
GROUP BY faixa_temperatura
ORDER BY faixa_temperatura;
```

### Faixa de umidade em SQL

```sql
SELECT
    CASE
        WHEN humidity_pct < 50 THEN 'Abaixo de 50%'
        WHEN humidity_pct >= 50 AND humidity_pct < 70 THEN '50% a 69,9%'
        ELSE '70% ou mais'
    END AS faixa_umidade,
    COUNT(*) AS total
FROM public.leituras
GROUP BY faixa_umidade
ORDER BY faixa_umidade;
```

No Power BI, use um gráfico de colunas ou barras agrupadas. Coloque a faixa no eixo e a contagem de registros nos valores.

## 26. Erros comuns e soluções

### Erro: senha do PostgreSQL incorreta

Verifique `DB_USER` e `DB_PASSWORD` no arquivo `.env`.

### Erro: porta 5432 ocupada

Outro PostgreSQL pode estar rodando na máquina. Verifique serviços ativos ou containers Docker.

### Erro: banco db_em não existe

A aplicação cria automaticamente o banco, mas o usuário configurado precisa ter permissão para criar banco.

### Erro: nodemon não reconhecido

Execute:

```bash
npm install
```

Depois rode novamente:

```bash
npm run dev
```

### Erro: rota não encontrada

Confira se a URL está correta. Exemplo correto:

```text
http://localhost:3000/api/leituras
```

### Erro: CSV não encontrado

Confirme se o arquivo existe em:

```text
data/em.csv
```

### Erro: humidity_pct deve estar entre 0 e 100

Corrija o valor de umidade no JSON ou no CSV.

## 27. Sugestões de melhorias futuras

- adicionar migrations;
- adicionar autenticação;
- adicionar testes automatizados;
- adicionar documentação Swagger;
- criar frontend;
- criar Dockerfile;
- criar docker-compose com PostgreSQL;
- adicionar logs estruturados;
- adicionar validação com biblioteca externa;
- criar endpoints analíticos para médias, máximas e mínimas.

## 28. Comandos para criar a estrutura do projeto

Linux/macOS:

```bash
mkdir -p backend-base-em/{data,sql,src/{config,controllers,dtos,middlewares,models,repositories,routes,scripts,services,utils},scripts/{linux,windows}}
cd backend-base-em
```

Windows CMD:

```bat
mkdir backend-base-em
cd backend-base-em
mkdir data
mkdir sql
mkdir src
mkdir src\config
mkdir src\controllers
mkdir src\dtos
mkdir src\middlewares
mkdir src\models
mkdir src\repositories
mkdir src\routes
mkdir src\scripts
mkdir src\services
mkdir src\utils
mkdir scripts
mkdir scripts\linux
mkdir scripts\windows
```

## 29. Passo a passo para subir no GitHub

Dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "Cria API REST em n-camadas com Node Express PostgreSQL e Sequelize"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/backend-base-em.git
git push -u origin main
```

Antes do commit, confira se o arquivo `.env` não está sendo versionado. Ele está protegido pelo `.gitignore`.

## 30. Passo a passo para clonar em outro computador

```bash
git clone https://github.com/SEU-USUARIO/backend-base-em.git
cd backend-base-em
cp .env.example .env
npm install
npm start
```

Depois, em outro terminal:

```bash
npm run import:csv:clear
```

## 31. Por que esta estrutura representa n-camadas

Esta estrutura representa o modelo de n-camadas porque cada parte tem uma responsabilidade clara:

- Routes definem os caminhos HTTP;
- Controller conversa com HTTP;
- DTO organiza entrada e saída;
- Service aplica regras e validações;
- Repository acessa o banco;
- Model representa a tabela;
- PostgreSQL armazena os dados.

Assim, a API evita misturar regra de negócio, HTTP e banco de dados no mesmo lugar.


## Segurança e escopo didático

Este projeto foi criado para estudo e testes **em ambiente local**. A rota `DELETE /api/leituras` apaga toda a tabela, não há autenticação, e o CORS aceita origens livremente. Não exponha esta API diretamente à Internet ou a uma rede não confiável. Para uso em produção, implemente autenticação, autorização, CORS restritivo, registro de auditoria, limites de taxa, testes automatizados e revisão de segurança.

O campo `timestamp` deve usar data e hora ISO 8601 com fuso explícito, como `2026-06-01T08:00:00-03:00` ou `2026-06-01T11:00:00Z`. Filtros apenas com data (`YYYY-MM-DD`) usam limites em UTC.

**Importante:** a validação de código não substitui um teste real de integração com uma instalação PostgreSQL e com as dependências instaladas.
