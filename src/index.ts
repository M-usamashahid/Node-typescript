import 'express-async-errors';
import { dbConnect } from "../src/config/mongoos";
import { loadEnv } from "../src/utils";

import { app } from './app';

/**
 * Server entry function for the bootstraping
 *  */
const start = async () => {
    const ENV = loadEnv()

    let db: string = ENV.DB_URI;

    await dbConnect({ db });

    app.listen(ENV.PORT, () => {
        console.log(
            `Server listening on Port: ${ENV.PORT} Environment: ${app.get("env")}`
        );
    });
};
start();