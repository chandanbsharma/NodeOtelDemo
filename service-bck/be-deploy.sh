docker build -t bck-service .
docker tag bck-service gcr.io/demootel/bck-service
docker push gcr.io/demootel/bck-service
kubectl apply -f ./be-application.yml --overwrite=true

# Apply the application.yaml file
#kubectl apply -f ./be-application.yml --overwrite=true