import { db } from "../database/database.connection.js";

export async function getRentals(req, res) {

    try {
        console.log(id)

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
