# Back-end test

The goal of this test is to build two services for a hosting platform admin panel.

Feel free to ask questions. Don't stay stuck for too long if you have difficulties or are missing informations.

## Requirements

- The services must be developed with Node.js using TypeScript.
- You must use a Postgres database for storage. 
- Use docker so anyone can run the project directly.
- Use git to version your code.
- Send your git repository as a zip file (including the `.git` directory).
- Add a write up explaining your choices and describing the work you did.

## Technical specifications

### The project server

- Use `koa` to create the server.
- The server must be secured by static bearer token that you provide (don't create a whole authentication system).
- The server must run on port `3000`.

### The data aggregation server

- Use `koa` to create the server.
- The server must be secured by a different static bearer token that you provide (don't create a whole authentication system).
- The server must run on port `3001`.

### Testing

You should create both end to end and unit tests.

### Libraries

- Use `knex` for database migration and database querying (do not use an ORM).
- Use `jest` for testing.
- You can use more libraries if needed.

### Data

You will find two files with some data:

- `./projects.json` contains the projects.
- `./users.json` contains a list of users.

You will notice that there are no requirements regarding a feature to create projects or users. Your code should then offer the possibility to seed the database with this data so it is possible to create deployments using those projects.

## Functional specifications

### Project service

This public service is supposed to be used to get informations related to projects and manage deployments.

#### Models

**Project**

| Field       | Type     |
| ----------- | -------- |
| id          | integer  |
| name        | string   |
| url         | string   | (is nullable)
| app_secret  | string   |
| created_at  | datetime |

**Deployment**

| Field       | Type     |
| ----------- | -------- |
| id          | integer  |
| deployed_in | integer  | (is nullable. It represent the time, in seconds, it took for the deployment to finish.)
| status      | string   | (possible values are `pending`, `building`, `deploying`, `failed`, `cancelled`, and `done`)
| created_at  | datetime |

_Relations_:

- **A Project has many Deployment**

**User**

| Field        | Type     |
| ------------ | -------- |
| id           | integer  |
| email        | string   |
| username     | string   |
| created_at   | datetime |

_Relations_:

- **A Project has an owner (user)**

#### API Requirements

For projects:
- An endpoint to retrieve a paginated list of projects with a page size of 8;
- An endpoint to retrieve a project by its unique identifier;
- An endpoint to create new deployments for a project. New deployments are created with the `pending` status;
- When a project is returned it should contain the two following flags:
  - `hasOngoingDeployment` should be set to `true` if the project has a deployment in the `pending`, `building`, or `deploying` status;
  - `hasLiveDeployment` flag should be set to `true` if the project has at least one deployment in the done `status`.

For deployments:
  - An endpoint to retrieve a paginated list of deployments with a page size of 8;
  - An endpoint to retrieve deployment by its unique identifier;
  - A webhook endpoint that can be used to receive status updates for a deployment:
    - If it's the first deployment of a project and the status is `done`, the webhook handler should update the project URL with a randomly generated URL;
    - When an update arrives with the `done` status, the `deployed_in` property on the deployment should be filled with the time it took (in seconds) to go from `pending` to `done`.
    - The webhook request are authenticated by checking the `authorization` header against the project `appSecret`.
  - An endpoint to cancel a deployment.

For every performed actions (deployment creation, cancellation, status update, ...) a new event must be created in the Data Aggregator service. The event must be created in an asynchronous fashion to not impact the performances of the project service. These events are used for analytics purposes, please include all the data you this is relevant into the payload.

You can find the API documentation in the [project-api.yaml](./project-api.yaml) file.

### Data aggregation service

This private service is meant to aggregate data. This data will be used for product analytics purposes and to provide an activity feed to the users.

#### Models

**Event**

| Field       | Type    |
| ----------- | ------- |
| id          | integer |
| name        | string  |
| payload     | json    |
| created_at  | string  |

#### API Requirements

This API need to provide a way to create new events.

## Bonus

If you have extra time and want to have fun you can do the following:
- Use Auth0 to handle the authentication layer of the project service.
- Add a new endpoint to get deployment statistics for a user:
  - Average weekly successful deployment;
  - Average weekly deployment count.
- Add a new endpoint to get an activity feed from the data aggregator service for a project.
