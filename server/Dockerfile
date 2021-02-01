FROM node
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
RUN cd /tmp && curl https://bootstrap.pypa.io/2.7/get-pip.py -o get-pip.py && python get-pip.py
RUN pip install opencv-python==4.2.0.32
RUN apt-get update -y && apt-get install -y python-mysqldb
RUN apt-get install -y software-properties-common && add-apt-repository ppa:mc3man/trusty-media -y || true  && pt-get update -y || true && apt-get install -y ffmpeg
RUN pip install python-dotenv
COPY mpeg1muxer.js node_modules/node-rtsp-stream
# RUN npm install
COPY . .
EXPOSE 3300
CMD [ "npm", "start" ]
