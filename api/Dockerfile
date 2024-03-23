# FROM node:18-slim AS build
FROM node:18 AS build
WORKDIR /app/
COPY ./package* ./
RUN npm i --no-cache
COPY . .
RUN npm run build
EXPOSE 80
CMD [ "node",  "/app/dist/main.js"]