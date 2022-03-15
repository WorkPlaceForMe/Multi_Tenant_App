cd client
ng build --optimization=true --aot=true --build-optimizer=true --index=src/indexProd.html --configuration=production &&
mv ./dist/indexProd.html ./dist/index.html &&
docker build -t $1 .