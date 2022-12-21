from dbconnection import Db
import os
from dotenv import load_dotenv
load_dotenv('scr.env')

MYSQL_IP = os.environ.get('HOST')

mysql_helper = Db(MYSQL_IP)

# result = mysql_helper.retrieve('scc')

# print(result)

# result2 = mysql_helper.insert('scc',["10", "2022-11-21 10:59:38", "0", "3b42ce1b-89e1-4d78-9d84-68645454de05", "test", "3333-666666-cccccc-nnnnnn", "3333-666666-cccccc-nnnnnn", "true", "false"])

# print(result2)

# result3 = mysql_helper.update('scc', "camera_name", "test10", "id", "6")

# print(result3)

result4 = mysql_helper.create('new', [
            ["time","datetime"],
            ["zone", "int(11)"],
            ["cam_name","varchar(45)"],
            ["id", "varchar(45)"],
            ["cam_id","varchar(45)"],
            ["id_account","varchar(45)"],
            ["id_branch", "varchar(45)"],
            ["track_id", "varchar(45)"]
            ])