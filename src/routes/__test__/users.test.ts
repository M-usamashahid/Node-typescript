import request from 'supertest';
import { app } from '../../app';

describe('Users Tests', () => {

    // Create User
    it('FAIL: Create User when trying to access without authorization', async () => {
        await request(app)
            .post('/api/user')
            .expect(401);
    });

    it('PASS: Create User', async () => {

        const token = await global.signin();

        const { body }: any = await request(app)
            .post('/api/user')
            .set('Cookie', token)
            .send({
                firstName: 'Second',
                lastName: 'Admin',
                email: 'admin.second@ezbank.com',
                password: "admin123",
            })
            .expect(200);

        expect(body._id).toBeDefined();
        expect(body.firstName).toEqual('Second');
        expect(body.lastName).toEqual('Admin');
        expect(body.email).toEqual('admin.second@ezbank.com');
    });
    // End

    // Get User
    it('FAIL: Get user when trying to access without authorization', async () => {
        await request(app)
            .get('/api/user/123')
            .expect(401);
    });

    it('PASS: Get user', async () => {
        const token = await global.signin();

        const { body } = await request(app)
            .post('/api/user')
            .set('Cookie', token)
            .send({
                firstName: 'Third',
                lastName: 'Admin',
                email: 'admin.third@ezbank.com',
                password: "admin123",
            })
            .expect(200);

        const verify = await request(app)
            .get(`/api/user/${body._id}`)
            .set('Cookie', token)
            .expect(200);

        expect(verify.body._id).toEqual(body._id);
        expect(verify.body.firstName).toEqual('Third');
        expect(verify.body.lastName).toEqual('Admin');
        expect(verify.body.email).toEqual('admin.third@ezbank.com');
    });
    // End

    // Update User
    it('FAIL: Update user when trying to access without authorization', async () => {
        await request(app)
            .put('/api/user/123')
            .expect(401);
    });

    it('PASS: Update User', async () => {
        const token = await global.signin();

        const { body } = await request(app)
            .post('/api/user')
            .set('Cookie', token)
            .send({
                firstName: 'Forth',
                lastName: 'Admin',
                email: 'admin.forth@ezbank.com',
                password: "admin123",
            })
            .expect(200);

        await request(app)
            .put(`/api/user/${body._id}`)
            .set('Cookie', token)
            .send({
                firstName: 'Forth update',
                lastName: 'Admin update',
            })
            .expect(200);

        const update = await request(app)
            .get(`/api/user/${body._id}`)
            .set('Cookie', token)
            .expect(200);

        expect(update.body.firstName).toEqual('Forth update');
        expect(update.body.lastName).toEqual('Admin update');

    });
    // End

    // Delete User
    it('FAIL: Delete user when trying to access without authorization', async () => {
        await request(app)
            .delete('/api/user/123')
            .expect(401);
    });

    it('PASS: Delete User', async () => {
        const token = await global.signin();

        const { body } = await request(app)
            .post('/api/user')
            .set('Cookie', token)
            .send({
                firstName: 'Fifth',
                lastName: 'Admin',
                email: 'admin.fifth@ezbank.com',
                password: "admin123",
            })
            .expect(200);

        await request(app)
            .delete(`/api/user/${body._id}`)
            .set('Cookie', token)
            .expect(200);

        const verify = await request(app)
            .get(`/api/user/${body._id}`)
            .set('Cookie', token)
            .expect(200);

        expect(verify.body).toEqual({});
    });
    // End

    // Login & Logout
    it('FAIL: When a email that does not exist is supplied', async () => {
        await request(app)
            .post('/api/login')
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .expect(401);
    });

    it('FAIL: When an incorrect password is supplied', async () => {

        await request(app)
            .post('/api/login')
            .send({
                email: 'admin@ezbank.com',
                password: 'aslkdfjalskdfj'
            })
            .expect(401);
    });

    it('PASS: Login', async () => {

        const response = await request(app)
            .post('/api/login')
            .send({
                email: 'admin@ezbank.com',
                password: 'admin123'
            })
            .expect(200);

        expect(response.get('Set-Cookie')).toBeDefined();
    });

    it('PASS: Logout', async () => {

        const token = await global.signin();

        await request(app)
            .post('/api/logout')
            .set('Cookie', token)
            .send({})
            .expect(200);
    });
    // End

});