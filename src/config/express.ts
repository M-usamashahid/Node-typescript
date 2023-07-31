import { json, urlencoded } from "body-parser";
import cookieSession from "cookie-session";
import morgan from "morgan";
import methodOverride from "method-override";
import { GenericServerError } from "../errors";

import cors from "cors";
import compression from "compression";

export const expressConfig = (app: any) => {
  app.set("trust proxy", true);

  app.use(urlencoded({ extended: true }));

  app.use(json());

  app.use(
    cookieSession({
      signed: false,
      secure: false,
    })
  );

  app.use(morgan("dev"));

  app.disable("x-powered-by");

  app.use(methodOverride());

  app.use(compression());

  app.use(cors());


  process.on("uncaughtException", (err) => {
    console.log("Process UncaughtException");
    console.log(err);
    throw new GenericServerError(err.toString());
  });

  process.on("exit", (code) => {
    console.log("Process Exit");
    throw new GenericServerError(code.toString());
  });
};
