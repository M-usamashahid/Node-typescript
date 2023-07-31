import { Request, Response } from "express";
import { dbGet, dbSave, dbUpdate } from "../utils/repository";

import { customer, account } from "../models";

import { NotAuthorizedError, NotFoundError } from "../errors";
import { sendResponce } from "../utils";

export const create = async (req: Request, res: Response) => {
    const { name, email, address } = req.body;

    const isExist: any = await dbGet(customer, { email }, true, null, null, null, null, null, null, 'all', true);

    if (isExist && !isExist.isDeleted) {
        throw new NotAuthorizedError("User already exists");
    } else if (isExist && isExist.isDeleted) {
        throw new NotAuthorizedError("User was deleted.");
    } else {

        const newUser: any = await dbSave(customer, {
            name, email, address, createdBy: req.currentUser._id
        })

        sendResponce(res, newUser);
    }
}

export const get = async (req: Request, res: Response) => {

    let query: any = {};
    let isSingle = false;
    const id = req.params.id;

    if (id) {
        query = {
            _id: id,
        };
        isSingle = true;
    }

    const allUsers = await dbGet(customer, query, isSingle, null, null, null, null, null, null, null, true);

    return sendResponce(res, allUsers);
}

export const update = async (req: Request, res: Response) => {
    const id = req.params.id;
    const body = req.body;

    const isExist: any = await dbGet(customer, { _id: id }, true, null, null, null, null, null, null, null, true);

    if (isExist) {

        delete body.createdAt
        delete body.createdBy
        delete body.accounts

        await dbUpdate(
            customer,
            { _id: id },
            {
                $set: {
                    ...body,
                    updatedBy: req.currentUser._id
                }
            }
        );

        if (body.name && body.name != isExist.name) {

            await dbUpdate(
                account,
                { 'customer.id': id },
                {
                    $set: {
                        'customer.name': body.name,
                        updatedBy: req.currentUser._id
                    }
                },
                { multi: true }
            );
        }

        return sendResponce(res, true);
    } else {
        throw new NotFoundError();
    }
}
