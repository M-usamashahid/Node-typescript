import request from 'supertest';
import { app } from '../../app';
import { customer } from '../../models';

describe('Transcations Tests', () => {
    let token: any = {};
    let customer1: any = {};
    let customer2: any = {};
    let account1: any = {};
    let account2: any = {};

    // Transfer Amount
    it('FAIL: Create Account when trying to access without authorization', async () => {
        await request(app)
            .post('/api/transcation')
            .expect(401);
    });

    /**Create prequsite two customers for transcations*/
    it('Pre-requisite: Create Customers', async () => {

        token = await global.signin();

        customer1 = await request(app)
            .post('/api/customers')
            .set('Cookie', token)
            .send({
                name: 'first customer',
                email: 'first@email.com',
                address: 'House A, Street A, City C, Country E'
            })
            .expect(200);

        customer2 = await request(app)
            .post('/api/customers')
            .set('Cookie', token)
            .send({
                name: 'second customer',
                email: 'second@email.com',
                address: 'House A, Street A, City C, Country E'
            })
            .expect(200);


        expect(customer1.body._id).toBeDefined();
        expect(customer1.body.name).toEqual('first customer');
        expect(customer1.body.email).toEqual('first@email.com');

        expect(customer2.body._id).toBeDefined();
        expect(customer2.body.name).toEqual('second customer');
        expect(customer2.body.email).toEqual('second@email.com');
    });
    // End


    /**Create prequsite two accounts from previously created Customers for transcations*/
    it('Pre-requisite: Create Customers', async () => {

        account1 = await request(app)
            .post('/api/accounts')
            .set('Cookie', token)
            .send({
                title: 'Account 1',
                amount: 5000,
                currency: "PKR",
                transferLimit: 50000,
                customerData: {
                    name: customer1.body.name,
                    id: customer1.body._id
                }
            })
            .expect(200);

        account2 = await request(app)
            .post('/api/accounts')
            .set('Cookie', token)
            .send({
                title: 'Account 2',
                amount: 1000,
                currency: "PKR",
                transferLimit: 50000,
                customerData: {
                    name: customer2.body.name,
                    id: customer2.body._id
                }
            })
            .expect(200);


        expect(account1.body._id).toBeDefined();
        expect(account1.body.title).toEqual('Account 1');
        expect(account1.body.amount).toEqual(5000);
        expect(account1.body.currency).toEqual('PKR');
        expect(account1.body.transferLimit).toEqual(50000);
        expect(account1.body.customer.name).toEqual(customer1.body.name);
        expect(account1.body.customer.id).toEqual(customer1.body._id);
        expect(account1.body.customer.id).toBeDefined();

        expect(account2.body._id).toBeDefined();
        expect(account2.body.title).toEqual('Account 2');
        expect(account2.body.amount).toEqual(1000);
        expect(account2.body.currency).toEqual('PKR');
        expect(account2.body.transferLimit).toEqual(50000);
        expect(account2.body.customer.name).toEqual(customer2.body.name);
        expect(account2.body.customer.id).toEqual(customer2.body._id);
        expect(account2.body.customer.id).toBeDefined();
    });


    /**Transfer amount from one account to another*/
    it('Pass: Transfer Amount 1000 from account1 to account2 ', async () => {

        await request(app)
            .post('/api/transcation')
            .set('Cookie', token)
            .send({
                creditAccount: {
                    title: account2.body.title,
                    id: account2.body._id,
                    customer: {
                        name: customer2.body.name,
                        id: customer2.body._id
                    }
                },
                debitedAccount: {
                    title: account1.body.title,
                    id: account1.body._id,
                    customer: {
                        name: customer1.body.name,
                        id: customer1.body._id
                    }
                },
                amount: "1000",
                currency: "PKR"
            })
            .expect(200);

    });

    /**Verify Success Transfer*/
    it('Pass: Verify success transfer amount account 1 and account 2 ', async () => {

        const verifyAccount1 = await request(app)
            .get(`/api/accounts/${account1.body._id}`)
            .set('Cookie', token)
            .expect(200);

        expect(verifyAccount1.body._id).toBeDefined();
        expect(verifyAccount1.body.title).toEqual('Account 1');
        expect(verifyAccount1.body.amount).toEqual(4000);
        expect(verifyAccount1.body.currency).toEqual('PKR');

        const verifyAccount2 = await request(app)
            .get(`/api/accounts/${account2.body._id}`)
            .set('Cookie', token)
            .expect(200);

        expect(verifyAccount2.body._id).toBeDefined();
        expect(verifyAccount2.body.title).toEqual('Account 2');
        expect(verifyAccount2.body.amount).toEqual(2000);
        expect(verifyAccount2.body.currency).toEqual('PKR');
    });

    /**Transfer amount from one account to another*/
    it('Fail: Transfer Amount 5000 from account1 to account2', async () => {

        await request(app)
            .post('/api/transcation')
            .set('Cookie', token)
            .send({
                creditAccount: {
                    title: account2.body.title,
                    id: account2.body._id,
                    customer: {
                        name: customer2.body.name,
                        id: customer2.body._id
                    }
                },
                debitedAccount: {
                    title: account1.body.title,
                    id: account1.body._id,
                    customer: {
                        name: customer1.body.name,
                        id: customer1.body._id
                    }
                },
                amount: "5000",
                currency: "PKR"
            })
            .expect(400);
    });


    it('Pass: Get all transcation from specific account', async () => {

        const { body } = await request(app)
            .get(`/api/transcation?accountId=${account1.body._id}`)
            .set('Cookie', token)
            .expect(200);

        expect(body.length).toEqual(2);

    });
    // End



});