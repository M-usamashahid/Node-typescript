import { dbConnect } from "../../src/config/mongoos";
import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { app } from '../app';

declare global {
    var signin: any;
    var mockDBObjectId: any;
}

let mongod: any;
beforeAll(async () => {

    mongod = await MongoMemoryServer.create();

    // ENV SET
    process.env.HOSTNAME = 'localhost';
    process.env.DB_URI = mongod.getUri();
    process.env.SECRET = 'SxDv46E3TKdS2FJ7U3pMWkr7FHUuAZ';
    process.env.JWT_KEY = 'mvHzGJBruV6etSGjgmwN9quMGnEyQG';

    await dbConnect({ db: process.env.DB_URI || "" });
});

beforeEach(async () => {
    jest.clearAllMocks();
});

afterAll(async () => {
    await mongod.stop();
    await mongoose.connection.close();
}, 60000);


global.signin = async () => {

    await request(app)
        .get('/api/seed/user')

    const response = await request(app)
        .post('/api/login')
        .send({
            email: 'admin@ezbank.com',
            password: 'admin123'
        })
        .expect(200);

    const cookie = response.get('Set-Cookie');

    return cookie;
}

global.mockDBObjectId = async () => {
    return new mongoose.Types.ObjectId().toHexString();
}