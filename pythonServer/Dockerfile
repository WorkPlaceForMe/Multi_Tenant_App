FROM python:3.6.9-slim
WORKDIR /usr/src/app
COPY . .
RUN apt-get update  && \
    apt-get install -y build-essential \
                       default-libmysqlclient-dev
RUN apt-get install -y libglib2.0-0 libsm6 libxrender1 libxext6 libgl1-mesa-glx
RUN pip install --no-cache-dir -r requirements.txt
RUN rm requirements.txt
EXPOSE 3330
CMD [ "python3", "main.py" ]