import { Router } from "express";
import { getCustomers, getCustomersById, postCustomers, updateCustomers } from "../controllers/customers.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { customerSchema } from "../schemas/customers.schema.js";

const customerRouter = Router()

customerRouter.get("/customers", getCustomers)
customerRouter.get("/customers/:id", getCustomersById)
customerRouter.post("/customers", validateSchema(customerSchema), postCustomers)
customerRouter.put("/customers/:id", validateSchema(customerSchema), updateCustomers)

export default customerRouter