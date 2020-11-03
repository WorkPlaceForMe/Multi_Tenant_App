#remove pass on key
openssl rsa -in original.key -out plain.key

#create key
sudo openssl genrsa -aes128 -out private.key 2048

#create csr
sudo openssl req -new -days 365 -key private.key -out request.csr

#create certificate 
sudo openssl x509 -in request.csr -out certificate.crt -req -signkey private.key -days 365

#other encryption
openssl rsa -in original.key -out plain.key