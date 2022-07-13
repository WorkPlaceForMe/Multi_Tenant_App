rm -rf dist
ng build --optimization=true --aot=true --build-optimizer=true --index=src/indexProd.html --configuration=production &&
docker build -t $1 .
docker push $1