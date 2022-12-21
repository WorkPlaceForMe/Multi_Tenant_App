import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  port = 3307,
  user="graymatics",
  password="graymatics",
  database="video_summarization"
)

mycursor = mydb.cursor()

mycursor.execute(' INSERT INTO progress(progress_value) VALUES (1) ')

mydb.commit()

print("Processing done. Status commited to MySQL.")