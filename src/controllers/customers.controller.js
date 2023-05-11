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
        console.log(customers.rows)
        res.send(customers.rows[0])
    } catch (err){
        res.status(500).send(err.message)
    }
}