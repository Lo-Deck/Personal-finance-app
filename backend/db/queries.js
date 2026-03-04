

const pool = require('./pool')


async function createUser(name, email, hashedpassword){

    const result = await pool.query("INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING id, name", [name, email, hashedpassword])
    return result.rows[0]

}



async function getUserByEmail(email){

    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email])
    return result.rows[0]

}




module.exports = { createUser, getUserByEmail }

