FROM node
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
RUN apt-get update
RUN apt-get -y install python3 python3-dev
RUN apt-get -y install python3-pip
RUN pip install opencv-python==4.5.5.64
RUN pip install mysqlclient
RUN apt-get install -y software-properties-common && add-apt-repository ppa:mc3man/trusty-media -y || true  && pt-get update -y || true && apt-get install -y ffmpeg
RUN pip install python-dotenv
COPY . .
EXPOSE 3300
CMD [ "npm", "start" ]
