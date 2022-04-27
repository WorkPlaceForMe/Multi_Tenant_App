FROM yt/vs:v1

RUN apt-get update

RUN apt-get install curl -y

WORKDIR /home/node

RUN curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh

RUN bash nodesource_setup.sh

RUN apt-get install -y nodejs

RUN node -v

WORKDIR /usr/src/app

COPY server/package*.json ./

RUN npm install

COPY server/ .

EXPOSE 3300

CMD [ "npm", "start" ]
