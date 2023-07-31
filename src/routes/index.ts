import { Router } from "express";

import users from "./users";
import customers from "./customers";
import accounts from "./accounts";
import transcations from "./transcations";

export default (router: Router) => {

  users(router);
  customers(router);
  accounts(router);
  transcations(router);
};
