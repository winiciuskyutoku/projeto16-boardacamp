import { Router } from "express";
import { delteRental, finishRental, getRentals, postRentals } from "../controllers/rentals.controller.js";

const rentalRouter = Router()

rentalRouter.get("/rentals", getRentals)
rentalRouter.post("/rentals", postRentals)
rentalRouter.post("/rentals/:id/return", finishRental)
rentalRouter.delete("/rentals/:id", delteRental)

export default rentalRouter