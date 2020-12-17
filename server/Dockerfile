FROM node:lts-alpine

RUN addgroup -g 1001 nodejs 
RUN adduser -u 1001 -G nodejs -h /home/nodejs/  -s /bin/bash -D nodejs

#Switch to nodejs user
USER nodejs
RUN mkdir /home/nodejs/app
WORKDIR /home/nodejs/app

# Download dependancies
COPY package*.json ./
RUN apt update -y && apt install -y python-pip && pip install --upgrade pip && pip install opencv-python==4.2.0.32
RUN npm install --production

COPY ./app ./app
COPY ./bin ./bin
COPY ./resources ./resources
COPY ./scripts ./scripts
COPY ./server.js ./
EXPOSE 8080

ENV  NODE_ENV production
CMD [ "node", "./bin/www" ]