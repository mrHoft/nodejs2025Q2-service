FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm install --no-fund --no-audit --loglevel=error
COPY . .
RUN npm run build && mv dist/src/* dist/ && rmdir dist/src

FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY doc ./doc
RUN --mount=type=cache,target=/root/.npm npm install --only=production --omit=dev --no-fund --no-audit --loglevel=error
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/.env* ./

EXPOSE 4000
CMD ["node", "dist/main.js"]
