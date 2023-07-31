import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { GenericServerError } from "../errors/generic-server-error";

declare global {
  namespace Express {
    interface Request {
      currentUser?: any;
    }
  }
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session && req.session.jwt) {
    try {

      const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);

      if (payload) {
        req.currentUser = payload;
        next();
      } else {
        throw new NotAuthorizedError();
      }
    } catch (e: any) {
      throw new GenericServerError(e.toString());
    }
  } else {
    throw new NotAuthorizedError("Token Not Provided");
  }
};
