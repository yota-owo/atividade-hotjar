# 1. Usa uma imagem oficial do Node.js super leve
FROM node:20-alpine

# 2. Instala o OpenSSL (Obrigatório para o Prisma no Alpine)
RUN apk add --no-cache openssl

# 3. Define a pasta de trabalho dentro do container
WORKDIR /app

# 4. Copia os arquivos de dependências primeiro (otimiza o cache do Docker)
COPY package*.json ./
COPY prisma ./prisma/

# 5. Instala as dependências e gera o motor do Prisma
RUN npm install
RUN npx prisma generate

# 6. Copia o resto do código da API (incluindo a pasta src)
COPY . .

# 7. Expõe a porta que a API vai rodar
EXPOSE 3000

# 8. O Comando de Inicialização Blindado!
# Tenta sincronizar as tabelas -> Tenta rodar o seed (se der erro de duplicidade, ele ignora) -> Inicia a API.
CMD npx prisma db push && (node prisma/seed.js || true) && node src/server.js