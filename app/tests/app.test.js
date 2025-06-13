const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('ToDo App', () => {
    it('should render home page', async () => {
        const res = await request(app).get('/');
        expect(res.status).to.equal(200);
    });

    it('should add a new todo', async () => {
        const res = await request(app)
            .post('/todo/add')
            .send({ text: 'Test Todo' })
            .set('Content-Type', 'application/x-www-form-urlencoded');
        expect(res.status).to.equal(302); // Redirect after adding
    });

    it('should toggle todo status', async () => {
        // First add a todo
        const addRes = await request(app)
            .post('/todo/add')
            .send({ text: 'Toggle Test' })
            .set('Content-Type', 'application/x-www-form-urlencoded');
        
        // Then get the page to extract the todo ID
        const getRes = await request(app).get('/');
        
        // Toggle the todo
        const toggleRes = await request(app)
            .post('/todo/toggle/1') // Using a known ID for test
            .set('Content-Type', 'application/x-www-form-urlencoded');
        expect(toggleRes.status).to.equal(302);
    });
});