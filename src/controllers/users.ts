import { Request, Response } from "express";
import { compare } from "bcrypt";

import { dbGet, dbRegister, dbUpdate } from "../utils/repository";
import { users } from "../models";

import { NotAuthorizedError, NotFoundError } from "../errors";
import { sendResponce, getAuthToken } from "../utils";

declare global {
  interface Request {
    session?: any;
    currentUser?: any;
  }
}

export const login = async (req: Request, res: Response) => {
  let { email, password } = req.body;

  let query = { email };
  const getUser: any = await dbGet(users, query, true);

  if (!getUser) {
    throw new NotAuthorizedError(
      "Either email or password was incorrect, please try again"
    );
  } else if (getUser && getUser.isDeleted) {
    throw new NotAuthorizedError(
      `You do not have access, please contact your admin`
    );
  } else if (getUser) {

    const result = await compare(password, getUser.password);

    if (result) {

      delete getUser.password;

      const jwt = await getAuthToken(getUser);

      req.session = { jwt };

      sendResponce(res, { jwt });
    } else {
      throw new NotAuthorizedError(
        "Either email or password was incorrect, please try again"
      );
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  req.session = null;

  sendResponce(res, true);
};

export const create = async (req: Request, res: Response) => {

  const { firstName, lastName, role, email, password } = req.body;

  const isExist: any = await dbGet(users, { email }, true, null, null, null, null, null, null, 'all', true);

  if (isExist && !isExist.isDeleted) {
    throw new NotAuthorizedError("User already exists");
  } else if (isExist && isExist.isDeleted) {
    throw new NotAuthorizedError("User was deleted.");
  } else {

    const newUser: any = await dbRegister(users, {
      firstName, lastName, role, email, password, createdBy: req.currentUser._id
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

  const allUsers = await dbGet(users, query, isSingle, '-password');

  return sendResponce(res, allUsers);
}

export const update = async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;

  const isExist = await dbGet(users, { _id: id }, true, null, null, null, null, null, null, null, true);

  if (isExist) {

    delete body.password;
    delete body.createdAt
    delete body.createdBy
    delete body.isDeleted

    await dbUpdate(
      users,
      { _id: id },
      {
        $set: {
          ...body,
          updatedBy: req.currentUser._id
        }
      }
    );

    return sendResponce(res, true);
  } else {
    throw new NotFoundError();
  }
}

export const remove = async (req: Request, res: Response) => {
  const id = req.params.id;

  const isExist = await dbGet(users, { _id: id }, true, null, null, null, null, null, null, null, true);

  if (isExist) {

    await dbUpdate(
      users,
      { _id: id },
      {
        $set: {
          isDeleted: true,
          updatedBy: req.currentUser._id
        }
      }
    );

    return sendResponce(res, true);
  } else {
    throw new NotFoundError();
  }
}

