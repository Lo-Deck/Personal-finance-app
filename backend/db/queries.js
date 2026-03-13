

const pool = require('./pool')



//create, login

async function createUser(name, email, hashedpassword){
    const result = await pool.query("INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email", [name, email, hashedpassword])
    return result.rows[0]
}

async function getUserByEmail(email){
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email])
    return result.rows[0]
}



//mockData

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
            )
        }

        for (const p of data.pots) {
            await client.query(
                "INSERT INTO pots (user_id, name, target, total, theme) VALUES ($1, $2, $3, $4, $5)",
                [userId, p.name, p.target, p.total, p.theme]
            )
        }

        await client.query('COMMIT')

    } catch (error) {

        await client.query('ROLLBACK')
        console.error("Erreur lors du seeding (queries.js) :", error)
        throw error

    } finally {
        client.release()
    }

}


/*************************************************************/

/*  CONTROLLER LES ROUTES DE QUERIES A FRONT GERER ET DISPLAY ERROR  
VOIR AUSSI POUR COLOR THEME QUI NE SEST PAS MIS A JOUR LORS DU CHANGEMENT EDIT POT COULEUR BLUE */

/*************************************************************/



//fetch data

async function queryBalance(id){
    const result = await pool.query("SELECT * FROM balance where user_id = $1;", [id])
    return result.rows
}

async function queryTransactions(id){
    const result = await pool.query("SELECT * FROM transactions where user_id = $1;", [id])
    return result.rows
}

async function queryBudgets(id){
    const result = await pool.query("SELECT * FROM budgets where user_id = $1;", [id])
    return result.rows
}

async function queryPots(id){
    const result = await pool.query("SELECT * FROM pots where user_id = $1;", [id])
    return result.rows
}



//budgets

async function addBudget(user_id, category, maximum, theme){
    const result = await pool.query("INSERT INTO budgets (user_id, category, maximum, theme) VALUES ($1, $2, $3, $4) RETURNING *;", [user_id, category, maximum, theme])
    return result.rows[0]
}

async function updateBudget(id, userId, category, maximum, theme){
    const result = await pool.query("UPDATE budgets SET category = $1, maximum = $2, theme = $3 WHERE id = $4 AND user_id = $5 RETURNING *;", [category, maximum, theme, id, userId])
    return result.rows[0]
}

async function deleteBudget(id, user_id){
    const result = await pool.query("DELETE from budgets WHERE id = $1 AND user_id = $2 RETURNING *;", [id, user_id])
    return result.rows[0]
}



//pots

async function addPot(user_id, name, target, theme){
    const result = await pool.query("INSERT INTO pots (user_id, name, target, theme) VALUES ($1, $2, $3, $4) RETURNING *;", [user_id, name, target, theme])
    // console.log('queries addPot result:', result)
    return result.rows[0]
}

async function updatePot(id, userId, name, target, theme){
    const result = await pool.query("UPDATE pots SET name = $1, target = $2, theme = $3 WHERE id = $4 AND user_id = $5 RETURNING *;", [name, target, theme, id, userId])
    return result.rows[0]
}


async function deletePot(potId, user_id){

    const client = await pool.connect()

    try{

        await client.query('BEGIN')

        const deletePot = await client.query("DELETE from pots WHERE id = $1 AND user_id = $2 RETURNING *;", [potId, user_id])
        if(deletePot.rowCount === 0){
            throw new Error("Pot not Found")
        }

        const amount = deletePot.rows[0].total

        const updateBalance = await client.query("UPDATE balance SET current = current + $1 WHERE user_id = $2 RETURNING *;", [amount, user_id])
        if (updateBalance.rowCount === 0){
            throw new Error("Balance Not Found")
        }

        await client.query('COMMIT')

        // console.log('deletePot.rows[0]', deletePot.rows[0])
        // console.log('updateBalance.rows[0]', updateBalance.rows[0])

        return {
            deletedPot: deletePot.rows[0],
            updatedBalance: updateBalance.rows[0]
        }

    } catch(error) {

        await client.query('ROLLBACK')
        throw error

    } finally {

        client.release()

    }

}





async function updateMoneyPot(amount, potId, user_id){

    const client = await pool.connect()

    try{

        await client.query('BEGIN')

        const updatedPot = await client.query("UPDATE pots SET total = total + $1 WHERE id = $2 AND user_id = $3 RETURNING *;", [amount, potId, user_id])
        if(updatedPot.rowCount === 0){
            throw new Error("Pot not Found")
        }

        const updatedBalance = await client.query("UPDATE balance SET current = current - $1 WHERE user_id = $2 AND (current - $1) >= 0 RETURNING *;", [amount, user_id])
        if (updatedBalance.rowCount === 0){
            throw new Error("Insufficient balance")
        }

        await client.query('COMMIT')

        // console.log('QUERIES SEND TO CONTROLLER updatedPot.rows[0]', updatedPot.rows[0]);
        // console.log('QUERIES SEND TO CONTROLLER updatedBalance.rows[0]', updatedBalance.rows[0]);
        
        return {
            updatedPot: updatedPot.rows[0],
            updatedBalance: updatedBalance.rows[0]
        }


    } catch(error) {

        await client.query('ROLLBACK')
        throw error

    } finally {

        client.release()

    }

}





module.exports = { createUser, getUserByEmail, seedUserData, queryBalance, queryTransactions, queryBudgets, queryPots, addBudget, deleteBudget, updateBudget, addPot, updatePot, deletePot, updateMoneyPot }
