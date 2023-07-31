import { Router } from "express";
import { body, param } from "express-validator";
import {
    validateRequest,
    requireAuth,
} from "../middlewares";

import { get, create, update } from "../controllers/customers";

export default (app: Router) => {

    app.post("/customers", requireAuth, [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Required fields missing"),
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Required fields missing")
    ], validateRequest, create);

    app.put("/customers/:id", requireAuth, validateRequest, update);

    app.get("/customers/:id?", requireAuth, get);




}