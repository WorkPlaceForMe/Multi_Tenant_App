rm -rf dist
ng build --optimization=true --aot=true --build-optimizer=true --configuration=production &&
docker build -t graymatics1/thk-ui:$1 .
docker push graymatics1/thk-ui:$1