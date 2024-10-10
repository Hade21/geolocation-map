FROM node:20-alpine AS base

WORKDIR /app

FROM base AS builder

COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

RUN npm run build

FROM builder AS release

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "run", "start:migrate:prod"]