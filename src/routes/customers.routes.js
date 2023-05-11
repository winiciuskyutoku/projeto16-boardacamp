import { Router } from "express";
import { getCustomers, getCustomersById } from "../controllers/customers.controller.js";

const customerRouter = Router()

customerRouter.get("/customers", getCustomers)
customerRouter.get("/customers/:id", getCustomersById)

export default customerRouter