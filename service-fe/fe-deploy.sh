docker build -t fe-service .
docker tag fe-service gcr.io/demootel/fe-service
docker push gcr.io/demootel/fe-service
kubectl apply -f  ./fe-application.yml --overwrite=true
# kubectl delete -f fe-application.yml

# Apply the application.yaml file
kubectl apply -f instrumentation.yml --overwrite=true

kubectl apply -f ./fe-application.yml --overwrite=true