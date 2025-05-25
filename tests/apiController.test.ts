import request from 'supertest';
import { app } from '../src/app'; // Adjust the import based on your app's structure
import { ApiController } from '../src/controllers/apiController';

describe('ApiController', () => {
    let apiController: ApiController;

    beforeAll(() => {
        apiController = new ApiController();
    });

    it('should return a 200 status for the health check endpoint', async () => {
        const response = await request(app).get('/api/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'OK' });
    });

    it('should start a scraping task', async () => {
        const response = await request(app).post('/api/scrape').send({
            url: 'https://example.com',
        });
        expect(response.status).toBe(202);
        expect(response.body).toHaveProperty('taskId');
    });

    it('should return a 400 status for invalid scraping request', async () => {
        const response = await request(app).post('/api/scrape').send({
            url: '',
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    // Add more tests as needed for other API endpoints
});