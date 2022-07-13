Instructions to run this platform:
-Install dependencies of node "npm install" on "server"'s folder and "client"'s folder.
-Install dependencies of requirements.txt on pythonServer.
One file need to be added in order to run the platform, this should be required by email:
- ./config.env
Configure INSTALL as true for the first deployment. Change back to false after running the platform for the first time.

Certain dependecies are:
-MySQL
-Node (14 or above)
-Angular CLI (12 or above for developing on client)
-Python

Once Installed these dependencies:
-On ./server folder run "npm start".
-On ./client folder run "ng serve" for development.

For docker deployment:
-Install MySQL.
-Change location of shared volumes at docker-compose to match the location of nginx.conf, config.env and resources folder.
-Check if resources has inside the folder called "logs".
-Configure credentials of config.env from MySQL and set INSTALL as true.
-Run docker-compose up.
-Change INSTALL to false.
