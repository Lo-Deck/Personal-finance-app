

require('dotenv').config()
const express = require('express')
const app = express()

const path = require('path')

app.use(express.json());


const pool = require('./db/pool')

const usersRouter = require('./routes/usersRouter')



const isAuth = require('./middleware/authMiddleware')




const session = require('express-session')
const pgSession = require('connect-pg-simple')(session);


//set express-session
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



app.use('/users', usersRouter)


app.use(express.static(path.join(__dirname, '..', 'frontend')))


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'))
})


app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'signup.html'))
})


app.get('/', isAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'))
})




const PORT = process.env.PORT || 3000

app.listen(PORT, (error) => {

    if(error){
        console.log('Error Server listening:', error)
        return
    }

    console.log(`Server listening on PORT: ${PORT}`)

})