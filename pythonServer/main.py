from app import app
import os
from dotenv import load_dotenv
load_dotenv('./configPython.env')

MODE = os.environ.get('MODE')


if __name__=='__main__':
    if MODE == 'production':
        print('Running in production')
        from waitress import serve
        serve(app, host="0.0.0.0", port=3330)
    else:
        print('Running in development')
        app.run(host='0.0.0.0', debug=False, port=3330)