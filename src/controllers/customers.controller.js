import { db } from "../database/database.connection.js";

export async function getCustomers(req, res){
    try{
        const customers = await db.query(`SELECT * FROM customers;`)
        res.send(customers.rows)
    } catch (err){
        res.status(500).send(err.message)
    }
}

export async function getCustomersById(req, res){
    const {id} = req.params

    try {
        const customers = await db.query(`SELECT * FROM customers WHERE id=$1;`, [id])
        if(!customers.rows[0]) return res.status(404).send("Esse usuario nao existe")

        res.send(customers.rows[0])
    } catch (err){
        res.status(500).send(err.message)
    }
}