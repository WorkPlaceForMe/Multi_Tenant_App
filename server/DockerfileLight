FROM alpine
RUN apk add --update nodejs npm
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3300
CMD ["npm", "start"]