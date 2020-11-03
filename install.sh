sudo apt-get update
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/default

sudo rm /etc/nginx/sites-enabled/default
sudo service nginx restart

sudo systemctl status nginx.service
