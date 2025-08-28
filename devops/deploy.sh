#!/bin/bash

# AWS Deployment Script for AI-Powered Telehealth System
# Usage: ./deploy.sh [environment] [region]

set -e

ENVIRONMENT=${1:-staging}
REGION=${2:-us-east-1}
PROJECT_NAME="telehealth"

echo "🚀 Deploying AI-Powered Telehealth System to $ENVIRONMENT environment in $REGION"

# Check AWS CLI installation
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check Docker installation
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install it first."
    exit 1
fi

# Set environment-specific variables
case $ENVIRONMENT in
    "production")
        CLUSTER_NAME="$PROJECT_NAME-prod-cluster"
        SERVICE_NAME="$PROJECT_NAME-prod-service"
        ;;
    "staging")
        CLUSTER_NAME="$PROJECT_NAME-staging-cluster"
        SERVICE_NAME="$PROJECT_NAME-staging-service"
        ;;
    *)
        echo "❌ Invalid environment. Use 'production' or 'staging'"
        exit 1
        ;;
esac

echo "📋 Environment: $ENVIRONMENT"
echo "📋 Region: $REGION"
echo "📋 Cluster: $CLUSTER_NAME"
echo "📋 Service: $SERVICE_NAME"

# Create ECR repositories if they don't exist
echo "🏗️  Creating ECR repositories..."

aws ecr describe-repositories --repository-names "$PROJECT_NAME-frontend" --region $REGION 2>/dev/null || \
aws ecr create-repository --repository-name "$PROJECT_NAME-frontend" --region $REGION

aws ecr describe-repositories --repository-names "$PROJECT_NAME-backend" --region $REGION 2>/dev/null || \
aws ecr create-repository --repository-name "$PROJECT_NAME-backend" --region $REGION

aws ecr describe-repositories --repository-names "$PROJECT_NAME-ml" --region $REGION 2>/dev/null || \
aws ecr create-repository --repository-name "$PROJECT_NAME-ml" --region $REGION

# Get ECR login
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com

# Get account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"

# Build and push Docker images
IMAGE_TAG=$(date +%Y%m%d-%H%M%S)

echo "🐳 Building and pushing Docker images with tag: $IMAGE_TAG"

# Frontend
echo "📦 Building frontend..."
cd frontend
docker build -t "$ECR_URI/$PROJECT_NAME-frontend:$IMAGE_TAG" .
docker push "$ECR_URI/$PROJECT_NAME-frontend:$IMAGE_TAG"
cd ..

# Backend
echo "📦 Building backend..."
cd backend
docker build -t "$ECR_URI/$PROJECT_NAME-backend:$IMAGE_TAG" .
docker push "$ECR_URI/$PROJECT_NAME-backend:$IMAGE_TAG"
cd ..

# ML Service
echo "📦 Building ML service..."
cd ml-service
docker build -t "$ECR_URI/$PROJECT_NAME-ml:$IMAGE_TAG" .
docker push "$ECR_URI/$PROJECT_NAME-ml:$IMAGE_TAG"
cd ..

echo "✅ All images built and pushed successfully!"

# Deploy infrastructure
echo "🏗️  Deploying infrastructure..."

# Create or update ECS cluster
aws ecs describe-clusters --clusters $CLUSTER_NAME --region $REGION 2>/dev/null || \
aws ecs create-cluster --cluster-name $CLUSTER_NAME --region $REGION

# Create task definition
echo "📝 Creating task definition..."
envsubst < devops/aws/task-definition.json > temp-task-definition.json

# Register task definition
TASK_DEFINITION_ARN=$(aws ecs register-task-definition \
    --cli-input-json file://temp-task-definition.json \
    --region $REGION \
    --query 'taskDefinition.taskDefinitionArn' \
    --output text)

echo "📋 Task Definition ARN: $TASK_DEFINITION_ARN"

# Update or create service
if aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $REGION &>/dev/null; then
    echo "🔄 Updating existing service..."
    aws ecs update-service \
        --cluster $CLUSTER_NAME \
        --service $SERVICE_NAME \
        --task-definition $TASK_DEFINITION_ARN \
        --region $REGION
else
    echo "🆕 Creating new service..."
    aws ecs create-service \
        --cluster $CLUSTER_NAME \
        --service-name $SERVICE_NAME \
        --task-definition $TASK_DEFINITION_ARN \
        --desired-count 1 \
        --region $REGION
fi

# Clean up temporary files
rm -f temp-task-definition.json

echo "✅ Deployment completed successfully!"
echo "🌐 Your application should be available shortly."

# Wait for deployment to complete
echo "⏳ Waiting for deployment to complete..."
aws ecs wait services-stable --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $REGION

echo "🎉 Deployment completed and services are stable!"

# Display service information
echo "📊 Service Status:"
aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $REGION --query 'services[0].{Name:serviceName,Status:status,Running:runningCount,Pending:pendingCount,Desired:desiredCount}'