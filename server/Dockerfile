FROM node
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
RUN cd /tmp && curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && python get-pip.py
RUN pip install opencv-python==4.2.0.32
RUN apt-get update -y && apt-get install -y python-mysqldb
RUN pip install python-dotenv
# RUN npm install
COPY . .
EXPOSE 3300
CMD [ "npm", "start" ]
