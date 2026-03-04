

require('dotenv').config()
const express = require('express')

// const pool = require('./db/pool')

const app = express()

const path = require('path')

const usersRouter = require('./routes/usersRouter')


const session = require('express-session')



if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); 
}

app.use(session({

    store: new pgSession({
        pool: pool,
        tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUnitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production'
    }

}))

/* VERIFIER APP.JS DANS GEMINI ET POURSUIVRE LOGIN AVEC REQ.SESSION  */



const PORT = process.env.PORT || 3000

app.listen(PORT, (error) => {

    if(error){
        console.log('Error Server listening:', error)
        return
    }

    console.log(`Server listening on PORT: ${PORT}`)

})