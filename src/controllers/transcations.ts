import { Request, Response } from "express";
import { dbGet, dbSave, dbUpdate } from "../utils/repository";

import { account, transcation } from "../models";

import { GenericServerError, BadRequestError } from "../errors";
import { sendResponce } from "../utils";
import mongoose from "mongoose";

export const create = async (req: Request, res: Response) => {
    const { creditAccount, debitedAccount, amount, currency } = req.body;

    const debitAccount: any = await dbGet(account, { _id: debitedAccount.id }, true, null, null, null, null, null, null, null, true);

    if (amount <= debitAccount.amount) {
        if (amount <= debitAccount.transferLimit) {
            const transaction: any = await mongoose.startSession();
            try {

                await transaction.startTransaction();

                const response = await Promise.all([
                    dbUpdate(account, { _id: debitedAccount.id }, { $inc: { amount: -amount } }),
                    dbUpdate(account, { _id: creditAccount.id }, { $inc: { amount: amount } }),
                    dbSave(transcation, {
                        amount, account: creditAccount, secondaryAccount: debitedAccount, currency, type: 'credit', createdBy: req.currentUser._id
                    }),
                    dbSave(transcation, {
                        amount, account: debitedAccount, secondaryAccount: creditAccount, currency, type: 'debit', createdBy: req.currentUser._id
                    })
                ]);

                await transaction.commitTransaction();
                await transaction.endSession();

                return sendResponce(res, { credit: response[2], debit: response[3] });
            } catch (error) {
                transaction.abortTransaction();
                transaction.endSession();
                throw new BadRequestError('Transcation Failed')
            }
        } else {
            throw new BadRequestError(`User single transcation limit is ${debitAccount.transferLimit}`);
        }
    } else {
        throw new BadRequestError("User have insufecient balance");
    }
}

export const get = async (req: Request, res: Response) => {

    let query: any = {};
    let isSingle = false;
    const id = req.params.id;
    const { accountId } = req.query

    if (accountId) {
        query = {
            'account.id': accountId
        };
        isSingle = false;
    }

    if (id) {
        query._id = id
        isSingle = true;
    }

    const allTranscation = await dbGet(transcation, query, isSingle, null, null, null, null, null, null, 'all', true);

    return sendResponce(res, allTranscation);
}

