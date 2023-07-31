import mongoose from "mongoose";
import { DatabaseConnectionError } from "../errors";

type TInput = {
  db: string;
};

export const dbConnect = ({ db }: TInput) => {
  return new Promise((resolve, reject) => {

    mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }).then(() => resolve(true), (error: any) => {
      throw new DatabaseConnectionError(error.toString());
    });

    mongoose.connection.on("connecting", () => {
      if (process.env.NODE_ENV !== 'test') {
        console.info("App DB connecting");
      }
    });

    mongoose.connection.on("connected", () => {
      if (process.env.NODE_ENV !== 'test') {
        console.info("App DB connected ");
      }
    });

    mongoose.connection.once("open", () => {
      if (process.env.NODE_ENV !== 'test') {
        console.info("App DB connection opened");
      }
    });

    mongoose.connection.on("reconnected", () => {
      if (process.env.NODE_ENV !== 'test') {
        console.info("App DB reconnected");
      }
    });

    mongoose.connection.on("disconnected", () => {
      if (process.env.NODE_ENV !== 'test') {
        console.info("App DB disconnected");
      }
    });

    mongoose.connection.on("error", (error: any) => {
      console.error("App DB : " + error);
      throw new DatabaseConnectionError(error.toString());
    });

  });

};
