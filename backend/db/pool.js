

const { Pool } = require('pg')


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})


pool.query('SELECT current_database(), now()' , (err, res) => {

    if(err){
        console.error('❌ Erreur de connexion à la base de données :', err.message)
    }

    else{
        console.log('✅ Connecté avec succès à :', res.rows[0].current_database);
        console.log('🕒 Heure du serveur DB :', res.rows[0].now);
    }

})




module.exports = pool
