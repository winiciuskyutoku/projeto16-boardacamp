import { Router } from "express";
import { getRentals, postRentals } from "../controllers/rentals.controller.js";

const rentalRouter = Router()

rentalRouter.get("/rentals", getRentals)
rentalRouter.post("/rentals", postRentals)

export default rentalRouter