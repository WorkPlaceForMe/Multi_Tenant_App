import cv2
import argparse
import MySQLdb
from dotenv import load_dotenv
import os
load_dotenv('./config.env')

parser = argparse.ArgumentParser()
parser.add_argument("--stream", type=str , default=False)
parser.add_argument("--id_account", type=str , default=False)
parser.add_argument("--id_branch", type=str , default=False)
parser.add_argument("--uuid", type=str , default=False)
args = parser.parse_args()

HOME = os.environ.get('home')
USER = os.environ.get('username')
PATHD = os.environ.get('pathDocker')
RES = os.environ.get('resources')
pathIm = ('{}{}{}{}{}/{}/').format(HOME,USER,PATHD,RES,args.id_account,args.id_branch)
ip = os.environ.get("my_ip")
docker = os.environ.get("DOCKER")

MYSQL_HOST = os.environ.get('HOST')
MYSQL_USER = os.environ.get('USERM')
MYSQL_PASSWORD = os.environ.get('PASSWORD')
MYSQL_DB = os.environ.get('DB')

cap = cv2.VideoCapture(args.stream) # video capture source camera (Here webcam of laptop)
ret,frame = cap.read() # return a single frame in variable `frame`
cv2.imwrite('{}pictures/heatmap_pics/{}_trigger.png'.format(pathIm,args.uuid),frame) #save the file
height=int(cap.get(4))
width=int(cap.get(3))
print("image saved")