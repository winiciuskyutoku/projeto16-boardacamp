import { Router } from "express";
import { finishRentals, getRentals, postRentals } from "../controllers/rentals.controller.js";

const rentalRouter = Router()

rentalRouter.get("/rentals", getRentals)
rentalRouter.post("/rentals", postRentals)
rentalRouter.post("/rentals/:id/return", finishRentals)

export default rentalRouter