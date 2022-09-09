rm -rf dist
ng build --optimization=true --aot=true --build-optimizer=true --configuration=production &&
docker build -t graymatics1/multi-tenant-ui:$1 .
docker push graymatics1/multi-tenant-ui:$1