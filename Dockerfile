FROM node:20-slim

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm ci

COPY . .

CMD ["npm", "run", "dev"]