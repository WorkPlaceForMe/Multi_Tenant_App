import requests
from Crypto.Cipher import AES
import os
from dotenv import load_dotenv
load_dotenv('scr.env')
import base64

BLOCK_SIZE = 16
pad = lambda s: s + (BLOCK_SIZE - len(s) % BLOCK_SIZE) * chr(BLOCK_SIZE - len(s) % BLOCK_SIZE)

class Db:
    def __init__(self, ip):
        SECRET = os.environ.get('SECRETAPIPROXY').encode()
        PASS = os.environ.get('PASSAPIPROXY')
        IV = os.environ.get('ENCRYPTIONIV').encode()
        self.ip = ip
        cipher = AES.new(SECRET, AES.MODE_CBC, IV)
        ciphertext = base64.b64encode(cipher.encrypt(pad(PASS).encode()))
        self.headers = {"proxy": f'{ciphertext.decode()}' }
    
    def retrieve(self, table):
        info = {
            "table": table
        }
        try:
            metadata = requests.post(f'http://{self.ip}:3302/api/v1/r', data=info, headers=self.headers)
            return metadata.json()
        except requests.exceptions.HTTPError as err:
            raise SystemExit(err)
    
    def insert(self, table, values):
        info = {
            "table": table,
            "values": values
        }
        try:
            metadata = requests.post(f'http://{self.ip}:3300/api/v1/i', data=info, headers=self.headers)
            return metadata.json()
        except requests.exceptions.HTTPError as err:
            raise SystemExit(err)
    
    def update(self, table, updateField, updateValue, key, value):
        info = {
            "table": table,
            "updtField": updateField,
            "updtValue": updateValue,
            "key": key,
            "value": value
        }
        try:
            metadata = requests.put(f'http://{self.ip}:3300/api/v1/u', data=info, headers=self.headers)
            return metadata.json()
        except requests.exceptions.HTTPError as err:
            raise SystemExit(err)

    def create(self, table, columns):
        cols = []
        for column in columns:
            col = {}
            if column[0] == 'id':
                column.append('NOT NULL')
                col["default"] = 'NOT NULL'
            else:
                column.append(' NULL')
                col["default"] = 'NULL'
            col["key"] = column[0]
            col["type"] = column[1]
            cols.append(col)
        info = {
            "table": table,
            "columns": cols,
        }
        try:
            metadata = requests.post(f'http://{self.ip}:3300/api/v1/c', json=info, headers=self.headers)
            return metadata.json()
        except requests.exceptions.HTTPError as err:
            raise SystemExit(err)
