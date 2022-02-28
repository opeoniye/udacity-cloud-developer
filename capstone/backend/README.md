# Backend
The backend for the Triple Love News app is a serverless app that is deployed on AWS Lambda. It makes use of the Serverless framework to deploy on AWS.
The Serveless framework uses a `.yml` config file to compose the resources to be deployed. The config file for this project is located in the root folder.

## How to Deploy
Change into the backend directory and run the following commands:

```
cd backend
sls
sls deploy
```

Once the project has been successfully deployed on AWS, you can visit your AWS dashboard and open the `Lambda` service to see your functions. 


