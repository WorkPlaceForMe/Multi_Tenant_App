import cv2
import argparse
import MySQLdb
from dotenv import load_dotenv
import os
load_dotenv('./config.env')

parser = argparse.ArgumentParser()
parser.add_argument("--cameraid", type=str , default=False)
parser.add_argument("--id_account", type=str , default=False)
parser.add_argument("--id_branch", type=str , default=False)
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

db = MySQLdb.connect(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB)
cursor = db.cursor()


cursor.execute('select id from cameras')
camid = cursor.fetchall()


cursor.execute('select name from cameras where id=\"{}\"'.format(args.cameraid))
name = cursor.fetchall()
name = name[0][0]
name = name.split(' ')
name = '_'.join(name)
cursor.execute('select rtsp_in from cameras where id=\"{}\"'.format(args.cameraid))
path = cursor.fetchall()
path = path[0][0]
cap = cv2.VideoCapture(path) # video capture source camera (Here webcam of laptop)
ret,frame = cap.read() # return a single frame in variable `frame`
cv2.imwrite('{}heatmap_pics/{}_heatmap.png'.format(pathIm,args.cameraid),frame) #save the file
height=int(cap.get(4))
width=int(cap.get(3))
print("image saved")
cursor.execute('update cameras set pic_height = \"{}\" where id=\"{}\"'.format(height,args.cameraid))
if docker == 'True':
    cursor.execute('update cameras set heatmap_pic = "/api/pictures/{}/{}/heatmap_pics/{}_heatmap.png" where id=\"{}\"'.format(args.id_account,args.id_branch,args.cameraid,args.cameraid))
else:
    cursor.execute('update cameras set heatmap_pic = "{}/api/pictures/{}/{}/heatmap_pics/{}_heatmap.png" where id=\"{}\"'.format(ip,args.id_account,args.id_branch,args.cameraid,args.cameraid))
# cursor.execute('update cameras set heatmap_pic = "/pictures/{}/{}/heatmap_pics/{}_heatmap.png" where id=\"{}\"'.format(ip,args.id_account,args.id_branch,args.cameraid,args.cameraid)) # for prod
cursor.execute('update cameras set pic_width = \"{}\" where id=\"{}\"'.format(width,args.cameraid))
cursor.execute('update cameras set cam_height = \"{}\" where id=\"{}\"'.format(height,args.cameraid))
cursor.execute('update cameras set cam_width = \"{}\" where id=\"{}\"'.format(width,args.cameraid))
db.commit()
cursor.fetchall()