import { Router } from "express";
import gameRouter from "./games.routes.js";

const router = Router()

router.use(gameRouter)

export default router