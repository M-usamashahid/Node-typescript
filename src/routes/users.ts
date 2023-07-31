import { Router } from "express";
import { body, param } from "express-validator";
import {
  validateRequest,
  requireAuth,
} from "../middlewares";

import { login, logout, create, update, get, remove } from "../controllers/users";

export default (app: Router) => {

  app.post("/login",
    [
      body("email").isEmail().withMessage("Email must be valid"),
      body("password")
        .trim()
        .notEmpty()
        .withMessage("You must supply a password"),
    ],
    validateRequest, login);

  app.post("/logout", requireAuth, logout);

  app.post("/user", requireAuth, [
    body("firstName")
      .trim()
      .notEmpty()
      .withMessage("You must supply a user name"),
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ], validateRequest, create);

  app.put("/user/:id", requireAuth, validateRequest, update);

  app.get("/user/:id?", requireAuth, get);

  app.delete("/user/:id", requireAuth, remove);



};
