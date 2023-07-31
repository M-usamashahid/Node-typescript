import request from 'supertest';
import { app } from '../../app';

describe('Accounts Tests', () => {
    let token: any = {};
    let customer: any = {};
    // Create Account
    it('FAIL: Create Account when trying to access without authorization', async () => {
        await request(app)
            .post('/api/accounts')
            .expect(401);
    });

    it('PASS: Create Accounts', async () => {

        token = await global.signin();

        customer = await request(app)
            .post('/api/customers')
            .set('Cookie', token)
            .send({
                name: 'first customer',
                email: 'first@email.com',
                address: 'House A, Street A, City C, Country E'
            })
            .expect(200);

        expect(customer.body._id).toBeDefined();
        expect(customer.body.name).toEqual('first customer');
        expect(customer.body.email).toEqual('first@email.com');
        expect(customer.body.address).toEqual('House A, Street A, City C, Country E');

        const { body }: any = await request(app)
            .post('/api/accounts')
            .set('Cookie', token)
            .send({
                title: 'Account 1',
                amount: 10000,
                currency: "PKR",
                transferLimit: 10000,
                customerData: {
                    name: customer.body.name,
                    id: customer.body._id
                }
            })
            .expect(200);

        expect(body._id).toBeDefined();
        expect(body.title).toEqual('Account 1');
        expect(body.amount).toEqual(10000);
        expect(body.currency).toEqual('PKR');
        expect(body.transferLimit).toEqual(10000);
        expect(body.customer.name).toEqual(customer.body.name);
        expect(body.customer.id).toEqual(customer.body._id);
        expect(body.customer.id).toBeDefined();
    });
    // End

    // Get Account
    it('FAIL: Get account when trying to access without authorization', async () => {
        await request(app)
            .get('/api/accounts/123')
            .expect(401);
    });

    it('PASS: Get account', async () => {

        const { body }: any = await request(app)
            .post('/api/accounts')
            .set('Cookie', token)
            .send({
                title: 'Account 2',
                amount: 50000,
                currency: "PKR",
                transferLimit: 50000,
                customerData: {
                    name: customer.body.name,
                    id: customer.body._id
                }
            })
            .expect(200);

        const verify = await request(app)
            .get(`/api/accounts/${body._id}`)
            .set('Cookie', token)
            .expect(200);

        expect(verify.body._id).toBeDefined();
        expect(verify.body.title).toEqual('Account 2');
        expect(verify.body.amount).toEqual(50000);
        expect(verify.body.currency).toEqual('PKR');
        expect(verify.body.transferLimit).toEqual(50000);
        expect(verify.body.customer.name).toEqual(customer.body.name);
        expect(verify.body.customer.id).toEqual(customer.body._id);
        expect(verify.body.customer.id).toBeDefined();
    });

    it('PASS: Get account by CustomerId', async () => {

        const verify = await request(app)
            .get(`/api/accounts?customerId=${customer.body._id}`)
            .set('Cookie', token)
            .expect(200);

        expect(verify.body[1]._id).toBeDefined();
        expect(verify.body[1].title).toEqual('Account 2');
        expect(verify.body[1].amount).toEqual(50000);
        expect(verify.body[1].currency).toEqual('PKR');
        expect(verify.body[1].transferLimit).toEqual(50000);
        expect(verify.body[1].customer.name).toEqual(customer.body.name);
        expect(verify.body[1].customer.id).toEqual(customer.body._id);
        expect(verify.body[1].customer.id).toBeDefined();
    });

    it('PASS: Get account by Title', async () => {

        const { body }: any = await request(app)
            .post('/api/accounts')
            .set('Cookie', token)
            .send({
                title: 'Account 4',
                amount: 50000,
                currency: "PKR",
                transferLimit: 50000,
                customerData: {
                    name: customer.body.name,
                    id: customer.body._id
                }
            })
            .expect(200);

        const verify = await request(app)
            .get(`/api/accounts?title=${body.title}`)
            .set('Cookie', token)
            .expect(200);

        expect(verify.body._id).toBeDefined();
        expect(verify.body.title).toEqual('Account 4');
        expect(verify.body.amount).toEqual(50000);
        expect(verify.body.currency).toEqual('PKR');
        expect(verify.body.transferLimit).toEqual(50000);
        expect(verify.body.customer.name).toEqual(customer.body.name);
        expect(verify.body.customer.id).toEqual(customer.body._id);
        expect(verify.body.customer.id).toBeDefined();
    });
    // End

});