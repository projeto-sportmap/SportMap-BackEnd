# SportMap - Back-end

API REST do SportMap (Node.js, Express 5, TypeScript e Prisma/PostgreSQL).

## Como executar

```bash
npm install
cp .env.example .env   # preencha DATABASE_URL e JWT_SECRET
npm run dev            # http://localhost:3000
```

Para produção:

```bash
npm run build
npm start
```

## Documentação da API (Swagger / OpenAPI)

Com a API em execução:

| O quê                         | URL                                  |
| ----------------------------- | ------------------------------------ |
| Interface interativa (Swagger UI) | `http://localhost:3000/api-docs`      |
| Especificação OpenAPI em JSON | `http://localhost:3000/api-docs.json` |


<img width="448" height="196" alt="image" src="https://github.com/user-attachments/assets/0010cdff-36fe-4ced-b713-e394d3e8bd8a" />


A porta e o endereço seguem as variáveis `PORT` e `API_ORIGIN` do `.env`.
O JSON pode ser importado no Postman, Insomnia ou em geradores de cliente.

### Como a documentação é gerada

- **Configuração:** `src/config/swagger.ts` (versão do OpenAPI, servidores, esquemas de segurança e schemas reutilizáveis).
- **Publicação:** `src/app.ts` chama `setupSwagger(app)`.
- **Conteúdo:** comentários `@swagger` acima de cada rota em `src/routes/*.ts`. O `swagger-jsdoc` lê esses comentários, então ao criar ou alterar uma rota basta atualizar o comentário dela.
- Se um comentário tiver YAML inválido, a API **não sobe** (`failOnErrors: true`), o que evita publicar documentação quebrada.

### Autenticação na documentação

1. Execute `POST /login` com e-mail e senha.
2. Clique em **Authorize** e informe o token no esquema `bearerAuth`.
3. Rotas de **anúncios** e **comentários** usam, por enquanto, o cabeçalho `x-user-id` (esquema `userIdHeader`, provisório). Informe o id numérico do usuário em **Authorize**.

## Scripts

| Comando                    | Descrição                          |
| -------------------------- | ---------------------------------- |
| `npm run dev`              | Servidor com recarga automática    |
| `npm run build`            | Compila para `dist/`               |
| `npm start`                | Executa o build                    |
| `npm test`                 | Testes unitários                   |
| `npm run test:integration` | Testes de integração (`.env.test`) |
| `npm run typecheck`        | Verificação de tipos               |
