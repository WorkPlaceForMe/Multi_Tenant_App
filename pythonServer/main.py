from app import app
import os
from dotenv import load_dotenv
load_dotenv('../config.env')
import logging
from logging.handlers import RotatingFileHandler
from time import strftime
import traceback
from flask import request

MODE = os.environ.get('NODE_ENV')
log = './resources/logs/pythonAccess.log'

@app.after_request
def after_request(response):
    timestamp = strftime('[%Y-%b-%d %H:%M]')
    logger.info('%s %s %s %s %s %s', timestamp, request.remote_addr, request.method, request.scheme, request.full_path, response.status)
    return response

@app.errorhandler(Exception)
def exceptions(e):
    tb = traceback.format_exc()
    timestamp = strftime('[%Y-%b-%d %H:%M]')
    logger.error('%s %s %s %s %s 5xx INTERNAL SERVER ERROR\n%s', timestamp, request.remote_addr, request.method, request.scheme, request.full_path, tb)
    return e

if __name__=='__main__':
    if MODE == 'production':
        print('Running in production')
        handler = RotatingFileHandler(log, maxBytes=100000, backupCount=3)
        logger = logging.getLogger('tdm')
        logger.setLevel(logging.INFO)
        logger.addHandler(handler)
        from waitress import serve
        serve(app, host="0.0.0.0", port=3330)
    else:
        print('Running in development')
        handler = RotatingFileHandler(log, maxBytes=100000, backupCount=3)
        logger = logging.getLogger('tdm')
        logger.setLevel(logging.INFO)
        logger.addHandler(handler)
        app.run(host='0.0.0.0', debug=False, port=3330)