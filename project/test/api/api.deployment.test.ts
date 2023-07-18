
import knex from '../../app/config/database';
import app from "../../app/app"
import request from 'supertest';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.iwRBOi0cQCeTpO00H3VRqNBLx43owfr6ZfuuQcgy4PA";
let appServer: any;
let appSecret: string;
describe('Deployment API', () => {
    let deploymentId: number;

    beforeAll(async () => {
        await knex.migrate.latest()
        await knex.seed.run()
        appServer = await (new app()).config()
        appSecret = "ST5I3FG1YR_8ZAT8OnjrP46pCg4PPMNGSt7-RwdVCu4"
        deploymentId = await createDeployment(1);
    });

    afterAll(async () => {
        // Delete all changes
        await knex.seed.run()
    });

    // Test for pagination
    it('should return the correct page', async () => {
        const response = await request(appServer.callback()).get('/deployments').set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(200);
    });

    // Test for pagination with limit parameter
    it('should return correct number of results', async () => {
        const response = await request(appServer.callback()).get('/deployments?page=1').set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(200);
        expect(response.body.length).toBeLessThanOrEqual(8);
    });

    // Test for out-of-range page
    it('should return an error for out-of-range page', async () => {
        const response = await request(appServer.callback()).get('/deployments?page=0').set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(400);
    });

    // Test for a specific deployment that exists
    it('should return a specific deployment', async () => {
        const response = await request(appServer.callback()).get('/deployments/' + deploymentId).set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(deploymentId);
    });

    // Test for a deployment that does not exist
    it('should return an error for non-existent deployment', async () => {
        const response = await request(appServer.callback()).get('/deployments/9999').set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(404);
    });

    // Test for canceling a deployment
    it('should cancel a deployment', async () => {
        const response = await request(appServer.callback()).post('/deployments/' + deploymentId + "/cancel").set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(200);
    });

    // Test for canceling a non-existent deployment
    it('should return an error when canceling a non-existent deployment', async () => {
        const response = await request(appServer.callback()).post('/deployments/9999/cancel').set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(404);
    });

    // Test for handling a webhook with valid request body
    it('should handle a webhook with valid request body', async () => {
        const mockWebhookRequest = {
            id: deploymentId,
            status: 'done'
        };
        const response = await request(appServer.callback()).post('/deployment/webhook').set('Authorization', 'Bearer ' + appSecret).send(mockWebhookRequest);
        expect(response.status).toBe(200);
    });

    // Test for handling a webhook with valid request body
    it('should handle a webhook with valid request body and update project url', async () => {
        let deploymentId_new = await createDeployment(2);

        const mockWebhookRequest = {
            id: deploymentId_new,
            status: 'done'
        };
        let response = await request(appServer.callback()).post('/deployment/webhook').set('Authorization', 'Bearer ' + appSecret).send(mockWebhookRequest);
        expect(response.status).toBe(200);
        response = await request(appServer.callback())
            .get("/projects/2")
            .set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(200);
        expect(response.body.url).not.toBeNull();
    });

    // Test for handling a webhook with invalid request body
    it('should return an error when handling a webhook with invalid request body', async () => {
        const mockWebhookRequest = {
            id: 'not-a-number',
            status: 'done'
        };
        const response = await request(appServer.callback()).post('/deployment/webhook').set('Authorization', 'Bearer ' + appSecret).send(mockWebhookRequest);
        expect(response.status).toBe(400);
    });

    // Test for handling a webhook with missing fields in request body
    it('should return an error when handling a webhook with missing fields in request body', async () => {
        const mockWebhookRequest = {
            id: 1
        };
        const response = await request(appServer.callback()).post('/deployment/webhook').set('Authorization', 'Bearer ' + appSecret).send(mockWebhookRequest);
        expect(response.status).toBe(400);
    });

    // Test for handling a webhook for a non-existent deployment
    it('should return an error when handling a webhook for a non-existent deployment', async () => {
        const mockWebhookRequest = {
            id: 9999,
            status: 'done'
        };
        const response = await request(appServer.callback()).post('/deployment/webhook').set('Authorization', 'Bearer ' + appSecret).send(mockWebhookRequest);
        expect(response.status).toBe(404);
    });
});


const createDeployment = async (project_id: number) => {
    const response = await request((appServer.callback()))
        .post("/projects/" + project_id + "/deployment")
        .set('Authorization', 'Bearer ' + token);
    return response.body.id
}