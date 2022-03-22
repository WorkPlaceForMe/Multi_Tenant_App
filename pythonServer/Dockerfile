FROM python:3.6.9-slim
COPY . .
RUN apt-get update  && \
    apt-get install -y build-essential \
                       default-libmysqlclient-dev
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 3330
CMD [ "python3", "main.py" ]