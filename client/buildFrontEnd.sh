rm -rf dist
ng build --optimization=true --aot=true --build-optimizer=true --configuration=production &&
docker build -t $1 .
docker push $1