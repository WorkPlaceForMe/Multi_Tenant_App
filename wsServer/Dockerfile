FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
RUN npm i pm2 -g
COPY . .
EXPOSE 3301
CMD ["pm2-runtime", "index.js"]