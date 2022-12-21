import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="graymatics",
  database="Video_Summerization"
)

mycursor = mydb.cursor()

mycursor.execute(' DELETE from progress ')

mydb.commit()