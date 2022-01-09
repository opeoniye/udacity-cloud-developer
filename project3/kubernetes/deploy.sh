kubectl apply -f api-feed-deployment.yaml
kubectl apply -f api-user-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f reverseproxy-deployment.yaml

kubectl apply -f api-feed-service.yaml
kubectl apply -f api-user-service.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f reverseproxy-service.yaml