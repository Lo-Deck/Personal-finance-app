

const { Pool } = require('pg')


const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT || 5432
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

// POSTGRES_HOST=localhost
// POSTGRES_USER=lolosuperuser
// POSTGRES_DB=db_finance_app
// POSTGRES_PASSWORD=12345678
// POSTGRES_PORT=5435


module.exports = pool