import request from 'supertest';
import { app } from '../../app';

describe('Customers Tests', () => {
    let token: any = {};
    // Create User
    it('FAIL: Create Customer when trying to access without authorization', async () => {
        await request(app)
            .post('/api/customers')
            .expect(401);
    });

    it('PASS: Create Customers', async () => {

        token = await global.signin();

        const { body }: any = await request(app)
            .post('/api/customers')
            .set('Cookie', token)
            .send({
                name: 'first customer',
                email: 'first@email.com',
                address: 'House A, Street A, City C, Country E'
            })
            .expect(200);

        expect(body._id).toBeDefined();
        expect(body.name).toEqual('first customer');
        expect(body.email).toEqual('first@email.com');
        expect(body.address).toEqual('House A, Street A, City C, Country E');
    });
    // End

    // Get User
    it('FAIL: Get customer when trying to access without authorization', async () => {
        await request(app)
            .get('/api/customers/123')
            .expect(401);
    });

    it('PASS: Get customer', async () => {

        const { body } = await request(app)
            .post('/api/customers')
            .set('Cookie', token)
            .send({
                name: 'second customer',
                email: 'second@email.com',
                address: 'House A, Street A, City C, Country E'
            })
            .expect(200);

        const verify = await request(app)
            .get(`/api/customers/${body._id}`)
            .set('Cookie', token)
            .expect(200);

        expect(verify.body._id).toEqual(body._id);
        expect(verify.body.name).toEqual('second customer');
        expect(verify.body.email).toEqual('second@email.com');
        expect(verify.body.address).toEqual('House A, Street A, City C, Country E');

    });
    // End

    // Update User
    it('FAIL: Update user when trying to access without authorization', async () => {
        await request(app)
            .put('/api/customers/123')
            .expect(401);
    });

    it('PASS: Update User', async () => {

        const { body } = await request(app)
            .post('/api/customers')
            .set('Cookie', token)
            .send({
                name: 'Third Customer',
                email: 'third@email.com',
                address: 'House A, Street A, City C, Country E'
            })
            .expect(200);

        await request(app)
            .put(`/api/customers/${body._id}`)
            .set('Cookie', token)
            .send({
                name: 'Third Customer Update',
                address: 'House B, Street B, City B, Country B'
            })
            .expect(200);

        const update = await request(app)
            .get(`/api/customers/${body._id}`)
            .set('Cookie', token)
            .expect(200);

        expect(update.body.name).toEqual('Third Customer Update');
        expect(update.body.address).toEqual('House B, Street B, City B, Country B');

    });
    // End

});