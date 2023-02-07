FROM node:alpine
WORKDIR /usr/src/app
RUN apk add --no-cache tzdata
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
CMD ["npm", "start"]