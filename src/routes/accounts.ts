import { Router } from "express";
import { body, param } from "express-validator";
import {
    validateRequest,
    requireAuth,
} from "../middlewares";

import { get, create } from "../controllers/accounts";

export default (app: Router) => {

    app.post("/accounts", requireAuth, [
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Required fields missing"),
        body("customerData")
            .isObject()
            .withMessage("Required fields missing"),
        body("customerData.name")
            .trim()
            .notEmpty()
            .withMessage("Required fields missing"),
        body("customerData.id")
            .isMongoId()
            .withMessage("Required fields missing")
    ], validateRequest, create);

    app.get("/accounts/:id?", requireAuth, get);

}