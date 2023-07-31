import { Request, Response } from "express";
import { dbGet, dbSave, dbUpdate } from "../utils/repository";

import { account, transcation, customer } from "../models";

import { BadRequestError, NotAuthorizedError, NotFoundError } from "../errors";
import { sendResponce } from "../utils";

/**
 * Create Function: this is used for account creation
 */
export const create = async (req: Request, res: Response) => {
    const { title, amount, currency, transferLimit, customerData } = req.body;

    const isExist: any = await dbGet(account, { title }, true, null, null, null, null, null, null, 'all', true);

    if (isExist && !isExist.isDeleted) {
        throw new NotAuthorizedError("Account title is already exists");
    } else if (isExist && isExist.isDeleted) {
        throw new NotAuthorizedError("Account was deleted with this title.");
    } else {

        const newAccount: any = await dbSave(account, {
            title, amount, currency, transferLimit, customer: customerData, createdBy: req.currentUser._id
        })
        const creditfrom: any = {
            account: {
                title,
                id: newAccount._id,
                customer: customerData
            }
        }
        try {
            await Promise.all([
                dbSave(transcation, { amount, ...creditfrom, currency, type: 'credit', createdBy: req.currentUser._id }),
                dbUpdate(customer, { _id: customerData.id }, {
                    $push: {
                        accounts: {
                            title,
                            accountId: newAccount._id
                        }
                    }
                })
            ])
        } catch (error: any) {
            throw new BadRequestError(error.message)
        }

        sendResponce(res, newAccount);
    }
}

/**
 * Get Function: this is used for get all acoounts, 
 * get a specific title account or get all account records of a specific customer
 * 
 */
export const get = async (req: Request, res: Response) => {

    let query: any = {};
    let isSingle = false;
    const id = req.params.id;
    const { title, customerId } = req.query

    if (customerId) {
        query = {
            'customer.id': customerId,
        };
        isSingle = false;
    }

    if (id) {
        query._id = id
        isSingle = true;
    }

    if (title) {
        query.title = title;
        isSingle = true;
    }



    const allAccounts = await dbGet(account, query, isSingle, null, null, null, null, null, null, null, true);

    return sendResponce(res, allAccounts);
}

