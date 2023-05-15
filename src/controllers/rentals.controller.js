import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {

    try {
        const rentals = await db.query(`
            SELECT rentals.*, customers.id  AS cid, customers.name AS cn,  games.id AS gid, games.name AS gn
            FROM rentals
            JOIN games
                ON "rentals"."gameId" = games.id
            JOIN customers
                ON "rentals"."customerId" = customers.id;
        `)

        const newRentals = rentals.rows.map(e => {
            return { ...e, customer: { id: e.cid, name: e.cn }, game: { id: e.gid, name: e.gn } }
        })

        newRentals.forEach(e => {
            delete e.cid
            delete e.cn
            delete e.gid
            delete e.gn
        })

        res.send(newRentals)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body
    const rentDate =  dayjs().format('YYYY-MM-DD')
    const returnDate = null
    const delayFee = null

    try {
        if(daysRented <= 0) return res.status(400).send("Insiria mais que um dia")

        const price = await db.query(`SELECT "games"."pricePerDay" FROM games WHERE id = ${gameId}`)

        const originalPrice = Number(daysRented) * Number(price.rows[0].pricePerDay)

        const checkCustomer = await db.query(`SELECT * FROM customers WHERE id = ${customerId}`)
        if(!checkCustomer.rows[0]) return res.status(400).send("Esse usuario nao existe")

        const checkGame = await db.query(`SELECT * FROM games WHERE id = ${gameId}`)
        if(!checkGame.rows[0]) return res.status(400).send("Esse videogame nao existe")

        const checkAvailability = await db.query(`SELECT "games"."stockTotal" FROM games WHERE id = ${gameId}`)
        if(checkAvailability.rows[0].stockTotal <= 0) return res.status(400).send("Game indisponivel")

        await db.query(`
            INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES (${customerId}, ${gameId}, '${rentDate}', ${daysRented}, ${returnDate}, ${originalPrice}, ${delayFee});
        `)

        res.send(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function finishRental(req, res){
    const {id} = req.params
    const rentDay =  dayjs().format('YYYY-MM-DD')

    try {
        const checkRental = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id])
        if(!checkRental.rows[0].id) return res.status(404).send("Esse aluguel nao existe!")
        if(checkRental.rows[0].returnDate !== null) return res.status(400).send("Esse item ja foi devolvido")

        const delayFee = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id])
        const fee = delayFee.rows[0].rentDate


        console.log(fee)
        const day = Math.floor((Date.now() - fee) / 86400000)

        if(day > delayFee.rows[0].daysRented) {
            await db.query(`UPDATE rentals SET "delayFee" = ${(day - delayFee.rows[0].daysRented) * delayFee.rows[0].originalPrice} WHERE id = $1;`, [id])
        } else {
            await db.query(`UPDATE rentals SET "delayFee" = 0 WHERE id = $1;`, [id])
        }

        await db.query(`UPDATE rentals SET "returnDate" = '${rentDay}' WHERE id = $1;`, [id])

        res.sendStatus(200)
    } catch (err){
        res.status(500).send(err.message)
    }
}

export async function delteRental(req, res){
    const {id} = req.params

    try {
        const checkRental = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id])
        if(!checkRental.rows[0]) return res.status(404).send("Esse aluguel nao existe!")
        if(checkRental.rows[0].returnDate === null) return res.status(400).send("Esse aluguel ainda nao foi finalziado")

        await db.query(`DELETE FROM rentals WHERE id = $1;`, [id])
        res.sendStatus(200)
    } catch (err){
        res.status(500).send(err.message)
    }
}