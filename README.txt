Instructions to run this platform:

This system comes with some information such as users for FR, pictures and rtsp's for cameras.
To make this work, would be needed a database installed in the MySQL on localhost. Data structure is on the attached file.

The functionatilies will still work without this data. To add new users, it's needed an Admin account. Internet connection is needed.

Two files need to be changed in order to run the platform:
- ./client/src/app/models/IpServer.ts
- ./server/config.env

The ip of the machine need to be specified.

Certain dependecies are:
-Node (12 or above)
-Angular Cli (8 or above, can be installed through "npm install -g @angular/cli")
-Http-server (module of node, to install "npm install http-server -g")

Once Installed this three dependencies:
-On ./client folder run "ng serve"
-On ./server folder run "node app.js"
-On ./server/fr_server folder run "node app.js"
-On the folder containing client, server and resources (by default should be named 'UI_v4.1'), run "http-server ./resources -p 6503"

On a browser, input "localhost:4200".
User and password would be required and a OTP.

///////////////////////DISCLAIMER\\\\\\\\\\\\\\\\\\\\\\\\\\\
This platform contains information of the employees of Graymatics and cameras from the office, this should not be uploaded unless is without test data. 
In order to upload for production, please contact "alex@graymatics.com".
\\\\\\\\\\\\\\\\\\\\END OF DISCLAIMER///////////////////////