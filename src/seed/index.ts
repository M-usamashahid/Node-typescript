import { Router, Request, Response } from "express";
import { dbGet, dbRegister, dbSaveMany } from "../utils/repository";
import { sendResponce } from "../utils";
import { BadRequestError, GenericServerError } from "../errors";
import { users, customer } from "../models";
import { SeedUser, SeedCustomer } from "./data";

export default (app: Router) => {

    // Insert Admin User
    app.get("/seed/user", async (req: Request, res: Response) => {
        try {
            const isSuperAdminInitialized = await dbGet(
                users,
                { email: "admin@ezbank.com" },
                true
            );

            if (!isSuperAdminInitialized) {
                const user = await dbRegister(users, SeedUser);

                sendResponce(res, user);
            } else {
                throw new Error("Users already initialized");
            }
        } catch (error: any) {
            // console.error(error.message);
            throw new BadRequestError(error.message);
        }

    });

    app.get("/seed/customer", async (req: Request, res: Response) => {
        try {
            const isCustomersInitialized: any = await dbGet(
                customer,
                { email: { $in: ["arisha@email.com", "branden@email.com", "rhonda@email.com", "georgina@email.com"] } },
                false
            );

            if (!isCustomersInitialized.length) {
                const customers = await dbSaveMany(customer, SeedCustomer);

                sendResponce(res, customers);
            } else {
                throw new Error("Customers already initialized");
            }
        } catch (error: any) {
            // console.error(error.message);
            throw new BadRequestError(error.message);
        }

    });


}
