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
    const {name, image, stockTotal, pricePerDay} = req.body

    const numStock = Number(stockTotal)
    const numPrice = Number(pricePerDay)
    
    try {
        const checkName = await db.query(`SELECT * FROM games WHERE name='${name}'`)
        if(checkName.rows[0]) return res.status(409).send("Ja existe um game com esse nome")

        await db.query(`INSERT INTO games ("name", "image", "stockTotal", "pricePerDay") VALUES ('${name}', '${image}', ${numStock}, ${numPrice});`)
      
        res.status(201).send("Game salvo com sucesso")
    } catch (err){
        res.status(500).send(err.message)
    }
}