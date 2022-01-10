#i++
kubectl apply -f api-feed-deployment.yaml
kubectl apply -f api-user-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f reverseproxy-deployment.yaml

kubectl apply -f api-feed-service.yaml
kubectl apply -f api-user-service.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f reverseproxy-service.yaml



#i--
kubectl delete -f api-feed-deployment.yaml
kubectl delete -f api-user-deployment.yaml
kubectl delete -f frontend-deployment.yaml
kubectl delete -f reverseproxy-deployment.yaml

kubectl delete -f api-feed-service.yaml
kubectl delete -f api-user-service.yaml
kubectl delete -f frontend-service.yaml
kubectl delete -f reverseproxy-service.yaml