import { Router } from "express";
import { body, param } from "express-validator";
import {
    validateRequest,
    requireAuth,
} from "../middlewares";

import { get, create } from "../controllers/transcations";

export default (app: Router) => {

    app.post("/transcation", requireAuth, [
        body("amount")
            .trim()
            .notEmpty()
            .withMessage("Required fields missing"),
        body("debitedAccount.id")
            .isMongoId()
            .withMessage("Required fields missing"),
        body("creditAccount.id")
            .isMongoId()
            .withMessage("Required fields missing"),
        body("debitedAccount.title")
            .trim()
            .notEmpty()
            .withMessage("Required fields missing"),
        body("creditAccount.title")
            .trim()
            .notEmpty()
            .withMessage("Required fields missing"),
        body("debitedAccount.customer.id")
            .isMongoId()
            .withMessage("Required fields missing"),
        body("creditAccount.customer.id")
            .isMongoId()
            .withMessage("Required fields missing"),
        body("debitedAccount.customer.name")
            .trim()
            .notEmpty()
            .withMessage("Required fields missing"),
        body("creditAccount.customer.name")
            .trim()
            .notEmpty()
            .withMessage("Required fields missing")
    ], validateRequest, create);


    app.get("/transcation/:id?", requireAuth, get);




}