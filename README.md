# sam-app

This project contains source code and supporting files for a serverless application that you can deploy with the SAM CLI. It includes the following files and folders.

events - Invocation events that you can use to invoke the function.
template.yaml - A template that defines the application's AWS resources.

The application uses several AWS resources, including Lambda functions and an API Gateway API. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

## Pre-requisites of the Project

Make sure you have an AWS account, and a MongoDB Atlas account.

## YAML File

There are three (3) end points for this test project:

- Products - lists the product from the MongoDB database
- Product Detail - diplays the product detail with and productId parameter from the MongoDB
- Orders - posts order to the MongoDB "orders" collection

```yaml
Events:
  Products:
    Type: Api
    Properties:
      Path: /products
      Method: get
  ProductDetail:
    Type: Api
    Properties:
      Path: /products/{productId}
      Method: get
  Orders:
    Type: Api
    Properties:
      Path: /post-order
      Method: post
```

## Packages Used
- MongoDB package - for the MongoDB connection string
- Lambda API package - for elegant endpoint codes in the handler.js file 
- DotENV package - for the environment variables (e.g. db connection string)

## Testing the Function Using SAM CLI

- sam local start-api --skip-pull-image

## Deploying

- sam build
- sam deploy --guided

## Testing the End Points Via Postman

### GET Event

All Products 
URL Used - http://localhost:3000/products
Method - GET

Product Detail
URL Used - http://localhost:3000/products/629a927bbc05fff21f85230f < _id from the MongoDb collection ('orders')
Method - GET

Post Order
URL Used - http://localhost:3000/post-order
Method - POST
Body - (example below)

```json
{
    "customer": {
        "first_name": "Jao",
        "last_name": "David",
        "email": "jamesdavid@example.com"
    },
    "items": [
        {
            "title": "USB Thumbdrive",
            "description": "Affordable drives.",
            "price": 80.00
        },
         {
            "title": "USB Cable",
            "description": "Affordable cables.",
            "price": 50.00
        }      
    ]
}
```

## Important Notes of this project

Running the AWS Lambda function locally runs smoothly, but for some unknow reasons, the MongoDB connection failed after deployment to the AWS Cloudformation stack and AWS Lambda. 