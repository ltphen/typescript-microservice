# Simple microservice project with nodejs


## Description

Briefly describe what your project does. Mention the services it offers and the problem it solves.

## Services

This project contains two microservices:

- **Project Service**.
- **Data Aggregation Service**.

## Prerequisites

- Docker
- Docker Compose
- Node.js

## Getting Started

To get a local copy up and running follow these simple steps:

### Unzip the repo

```bash
unzip <repo_url>
```


Navigate to the directory containing the `docker-compose.yml` file and run:

```bash
docker-compose up --build
```

## Usage

After starting the services, the Project service is available on `http://localhost:3000/api/docs` and the Data Aggregation service on `http://localhost:3001`.

## Running Tests

To run tests, use the following command:

```bash
npm run test:once
```

This should be done in specific projects. And in that case, you should copy the .env (from the docker-compose file) if you want to do it on the local machine. Otherwise, run the test command in the docker container.

## Some Testing Keys

- App Secret: theAppSecret
- Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.iwRBOi0cQCeTpO00H3VRqNBLx43owfr6ZfuuQcgy4PA

You can generate tokens using: https://jwt.io/ with the jwt-key in the docker-compose file
