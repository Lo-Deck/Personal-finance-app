

const pool = require('./pool')


async function createUser(name, email, hashedpassword){
    const result = await pool.query("INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email", [name, email, hashedpassword])
    return result.rows[0]
}


async function getUserByEmail(email){
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email])
    return result.rows[0]
}








async function seedUserData(userId, data){


    const client = await pool.connect()


    try{

        await client.query('BEGIN')


        await client.query(
            "INSERT INTO balance (user_id, current, income, expenses) VALUES ($1, $2, $3, $4)",
            [userId, data.balance.current, data.balance.income, data.balance.expenses]
        )



        for(const t of data.transactions){

            await client.query(
                "INSERT INTO transactions (user_id, avatar, name, category, date, amount, recurring) VALUES ($1, $2, $3, $4, $5, $6, $7)",
                [userId, t.avatar, t.name, t.category, t.date, t.amount, t.recurring]
            )

        }



        for (const b of data.budgets) {

            await client.query(
                "INSERT INTO budgets (user_id, category, maximum, theme) VALUES ($1, $2, $3, $4)",
                [userId, b.category, b.maximum, b.theme]
            );

        }

        for (const p of data.pots) {

            await client.query(
                "INSERT INTO pots (user_id, name, target, total, theme) VALUES ($1, $2, $3, $4, $5)",
                [userId, p.name, p.target, p.total, p.theme]
            );

        }

        await client.query('COMMIT');

    } catch (error) {

        await client.query('ROLLBACK');
        console.error("Erreur lors du seeding (queries.js) :", error);
        throw error;

    } finally {

        client.release();

    }



}


module.exports = { createUser, getUserByEmail, seedUserData }
