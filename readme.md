# Project Name

Add your project name here.

## Description

Briefly describe what your project does. Mention the services it offers and the problem it solves.

## Services

This project contains two microservices:

- **Project Service**: Add a brief description of what this service does.
- **Data Aggregation Service**: Add a brief description of what this service does.

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
docker-compose up
```

## Usage

After starting the services, the Project service is available on `http://localhost:3000/api/docs` and the Data Aggregation service on `http://localhost:3001`.

## Running Tests

To run tests, use the following command:

```bash
npm run test:once
```

## Some Testing Keys

- App Secret: theAppSecret
- Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.iwRBOi0cQCeTpO00H3VRqNBLx43owfr6ZfuuQcgy4PA

You can generate tokens using: https://jwt.io/ with the key in the docker-compose file