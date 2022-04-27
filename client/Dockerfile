FROM node:16.14.0-alpine AS builder

WORKDIR /app

COPY ./client/ /app/

RUN npm install

RUN npm run build:prod

FROM nginx:1.17.1-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
