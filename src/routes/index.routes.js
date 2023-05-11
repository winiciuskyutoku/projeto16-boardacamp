import { Router } from "express";
import gameRouter from "./games.routes.js";
import customerRouter from "./customers.routes.js";

const router = Router()

router.use(gameRouter)
router.use(customerRouter)

export default router