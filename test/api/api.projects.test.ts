import knex from './../../app/config/database';
import app from "./../../app/app"
import request from 'supertest';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.x_dEqK8pXfrqMhtF45yLtyC8qYNuRFDkRJCdlEyNOkA";
let appServer: any;
describe('Project API', () => {
    let projectId: string;

    beforeAll(async () => {
        await knex.migrate.latest()
        await knex.seed.run()
        appServer = await (new app()).config()
    });

    afterAll(async () => {
        // Delete all changes
        // await knex.seed.run()
    });

    it('should list return a 401', async () => {
        const response = await request(appServer.callback())
            .get("/projects")
            .set('Authorization', 'Bearer ');
        expect(response.status).toBe(401);
        expect(Object.keys(response.body)).toEqual(
            expect.arrayContaining(['name', 'message'])
        );
    });

    it('should list all projects', async () => {
        const response = await request(appServer.callback())
            .get("/projects")
            .set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(8)
        expect(response.body[0]).toHaveProperty("id")
        expect(response.status).toEqual(200);
    });

    it('should get a specific project', async () => {
        const response = await request(appServer.callback())
            .get("/projects/1")
            .set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(200);
        expect(response.status).toEqual(200);
    });

    it('should return an error', async () => {
        const response = await request(appServer.callback())
            .get("/projects/0")
            .set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(404);
    });

    it('should trigger a new deployment for a project', async () => {
        const response = await request(appServer.callback())
            .post("/projects/1/deployment")
            .set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(200);
        expect(response.status).toEqual(200);
    });

    it('should return the correct page', async () => {
        const response = await request(appServer.callback()).get('/projects?page=2')
            .set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(8);
    });

    it('should return an error for the page number', async () => {
        const response = await request(appServer.callback())
            .get('/projects?page=0')
            .set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(400);
        expect(Object.keys(response.body)).toEqual(
            expect.arrayContaining(['name', 'message'])
        );
    });
});

