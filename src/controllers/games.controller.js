import { db } from "../database/database.connection.js";

export async function getGames(req, res){
    try {
        const games = await db.query(`SELECT * FROM games;`)
        res.send(games.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function postGames(req, res){
    try {

    } catch (err){
        res.status(500).send(err.message)
    }
}