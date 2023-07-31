import { Response } from "express";
import dotenv from "dotenv-safe";
import { sign } from "jsonwebtoken";

export const loadEnv = () => {
  const result: any = dotenv.config();

  const { parsed: envs } = result;

  return envs;
};

export const getAuthToken = async (user: any) => {
  const ENV = loadEnv();

  return sign({
    _id: user._id,
    name: user.firstName + " " + user.lastName,
    email: user.email
  }, ENV.JWT_KEY!);
}

export const sendResponce = (res: Response, data: any, statusCode: number = 200) => {
  return res.status(statusCode).send(data);
};

