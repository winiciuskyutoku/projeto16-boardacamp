import { db } from "../database/database.connection.js";

export async function getCustomers(req, res) {
    try {
        const customers = await db.query(`SELECT * FROM customers;`)

        customers.rows.map(e => {
            const date = new Date(e.birthday);
            e.birthday = date.toISOString().substring(0, 10);
        })

        res.send(customers.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getCustomersById(req, res) {
    const { id } = req.params

    try {
        const customers = await db.query(`SELECT * FROM customers WHERE id=$1;`, [id])
        if (!customers.rows[0]) return res.status(404).send("Esse usuario nao existe")

        const date = new Date(customers.rows[0].birthday)

        const updatedDate = {
            ...customers.rows[0],
            birthday: date.toISOString().substring(0, 10)
        }

        res.send(updatedDate)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function postCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body

    try {
        const customers = await db.query(`SELECT * FROM customers WHERE cpf='${cpf}';`)

        console.log(customers.rows[0])
        if (customers.rows[0]) return res.status(409).send("Cpf de usuario ja existente")

        await db.query(`INSERT INTO customers ("name", "phone", "cpf", "birthday") VALUES ('${name}', '${phone}', '${cpf}', '${birthday}');`)


        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function updateCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body
    const { id } = req.params

    try {

        const customers = await db.query(`SELECT "cpf" FROM customers WHERE id <> $1 AND "cpf" = '${cpf}';`, [id])
        console.log(customers.rows)

        if (customers.rows.length !== 0) return res.status(409).send("Cpf de usuario ja existente")

        await db.query(
            `UPDATE customers 
            SET "name" = '${name}', "phone" = '${phone}', "cpf" = '${cpf}', "birthday" = '${birthday}'
            WHERE id = $1;`, [id]
        )


        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}