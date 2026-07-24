import { defineConfig, env } from '@prisma/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  earlyAccess: true,
  datasource: {
    // Usamos DIRECT_URL para garantir a conexão direta na porta 5432 durante as migrações
    url: process.env.DIRECT_URL || env("DIRECT_URL"),
  },
});