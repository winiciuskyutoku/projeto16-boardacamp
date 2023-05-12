import { Router } from "express";
import gameRouter from "./games.routes.js";
import customerRouter from "./customers.routes.js";
import rentalRouter from "./rentals.routes.js";

const router = Router()

router.use(gameRouter)
router.use(customerRouter)
router.use(rentalRouter)

export default router