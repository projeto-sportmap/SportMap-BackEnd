// Arquivo: tests/setup.ts
process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.API_ORIGIN = 'http://localhost:3000';
process.env.FRONTEND_ORIGIN = 'http://localhost:5173';
process.env.DATABASE_URL = 'postgresql://unused:unused@localhost:5432/not_used';
process.env.JWT_SECRET = 'chave-exclusiva-de-testes-com-mais-de-32-caracteres';