# ToDo App Deployment on Amazon ECS

This repository contains a simple ToDo list application built with Express.js and Handlebars, designed to be deployed on Amazon ECS (Elastic Container Service).

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI installed and configured
3. Docker installed locally
4. Node.js and npm installed (for local development)

## Local Development

1. Clone this repository
2. Navigate to the app directory:
   ```bash
   cd app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the application:
   ```bash
   npm start
   ```
5. Access the application at http://localhost:80

## Building and Testing the Docker Image

1. Build the Docker image:
   ```bash
   docker build -t todo-app .
   ```
2. Run the container locally:
   ```bash
   docker run -p 80:80 todo-app
   ```
3. Access the application at http://localhost:80

## Deploying to Amazon ECS

### 1. Create an ECR Repository

```bash
aws ecr create-repository --repository-name todo-app
```

### 2. Push the Docker Image to ECR

1. Authenticate Docker to your ECR registry:
   ```bash
   aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account-id.dkr.ecr.your-region.amazonaws.com
   ```

2. Tag your image:
   ```bash
   docker tag todo-app:latest your-account-id.dkr.ecr.your-region.amazonaws.com/todo-app:latest
   ```

3. Push the image:
   ```bash
   docker push your-account-id.dkr.ecr.your-region.amazonaws.com/todo-app:latest
   ```

### 3. Create an ECS Cluster

1. Create a new ECS cluster through the AWS Console or using AWS CLI:
   ```bash
   aws ecs create-cluster --cluster-name todo-app-cluster
   ```

### 4. Create Task Definition

1. Create a task definition JSON file (task-definition.json):
   ```json
   {
     "family": "todo-app",
     "containerDefinitions": [
       {
         "name": "todo-app",
         "image": "your-account-id.dkr.ecr.your-region.amazonaws.com/todo-app:latest",
         "cpu": 256,
         "memory": 512,
         "portMappings": [
           {
             "containerPort": 3000,
             "hostPort": 3000,
             "protocol": "tcp"
           }
         ],
         "essential": true
       }
     ],
     "requiresCompatibilities": ["FARGATE"],
     "networkMode": "awsvpc",
     "cpu": "256",
     "memory": "512"
   }
   ```

2. Register the task definition:
   ```bash
   aws ecs register-task-definition --cli-input-json file://task-definition.json
   ```

### 5. Create an ECS Service

1. Create a service:
   ```bash
   aws ecs create-service \
     --cluster todo-app-cluster \
     --service-name todo-app-service \
     --task-definition todo-app:1 \
     --desired-count 1 \
     --launch-type FARGATE \
     --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxxx],securityGroups=[sg-xxxxxx],assignPublicIp=ENABLED}"
   ```

### 6. Access Your Application

Once the service is running, you can access your application through the public IP assigned to your task or through an Application Load Balancer if you've configured one.

## Monitoring

- Monitor your application through CloudWatch metrics in the ECS console
- View container logs in CloudWatch Logs
- Set up CloudWatch Alarms for important metrics

## Cleanup

To avoid unnecessary charges, remember to clean up your resources when you're done:

1. Delete the ECS Service
2. Delete the ECS Cluster
3. Delete the ECR Repository
4. Delete any associated CloudWatch Log groups

## Running Tests

To run the application tests:
```bash
npm test
```

## Security Considerations

- Always use private subnets for your ECS tasks when possible
- Implement proper security groups
- Use AWS Secrets Manager for sensitive information
- Keep your container images updated with security patches

## Support

For issues and questions, please open an issue in this repository.
