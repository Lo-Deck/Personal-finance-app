# Frontend Mentor - Personal finance app solution

This is a solution to the [Personal finance app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/personal-finance-app-JfjtZgyMt1). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)


## Overview

### The challenge

Users should be able to:

- Save details to a database (build the project as a full-stack app)
- Create an account and log in (add user authentication to the full-stack app)


### Links

- Solution URL: [Repositories](https://github.com/Lo-Deck/Personal-finance-app).
- Live Site URL: [Website](https://personal-finance-app-lake-six.vercel.app/sign-in).


## My process

### Built with

- Node
- Express
- Postgres SQL


### What I learned

I built a robust RESTful API using Node.js, Express, postgres SQL. I implemented a clean architecture following the pattern:

Database (Postgres) ➜ Controllers ➜ Routes ➜ App.js

I used raw SQL queries with the pg library, ensuring security through parameterized queries to prevent SQL injection.

```js

async function createUser(name, email, hashedpassword){
    const result = await pool.query("INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email", [name, email, hashedpassword])
    return result.rows[0]
}

```

Implemented strict server-side validation using express-validator to sanitize inputs and enforce data rules (email format, password length, etc.).

```js

const loginValidation = [

    body("email").trim()
        .notEmpty().withMessage("Email is required.")
        .isEmail().withMessage("Email must be properly formatted."),

    body('password').notEmpty().withMessage('Password is required.')
        .isLength({ min: 8, max: 128 }).withMessage('Password must be at leat 8 characters.'),

]
```

Used bcrypt for secure password hashing and managed user sessions to authorize access.

```js

async function loginUser (req, res) {

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        const errorMessage = errors.array()[0].msg
        return res.status(400).json({
            error: errorMessage,
            formData: req.body
        })
    }

    const { email, password } = matchedData(req)

    try{

        const user = await db.getUserByEmail(email)

        if (!user) {
            return res.status(401).json({
                error: 'Wrong user'
            })
        }


        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (isPasswordValid) {

            req.session.user = { id: user.id, name: user.name, email: user.email };

            return res.status(200).json({
                message: 'User login with success',
                userId: user.id,
                username: user.name,
                email: user.email
            })

        }
        else {

            return res.status(401).json({
                error: 'Wrong Password to login'
            })

        }

    } catch(error){

        return res.status(500).json({
            error: 'Error impossible to reach the server',
            formData: req.body 
        })

    }

}

```

To protect the application from common web vulnerabilities and malicious attacks, I implemented several security layers:

I used Helmet.js to secure Express apps by setting various HTTP headers (XSS protection, Content Security Policy, etc.).


```js
const helmet = require('helmet')
app.use(helmet())

```

A General Limiter to prevent DDoS attacks (100 requests per 15 min), A strict Auth Limiter on login/register routes to prevent brute-force attacks (limited to 10 attempts per hour)


```js

const rateLimit = require('express-rate-limit')

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many request from this address, try it later.',
  standardHeaders: true, 
  legacyHeaders: false,
})


const rateLimit = require('express-rate-limit')

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Too many connexion attempts, try again in an hour.',
  standardHeaders: true,
  legacyHeaders: false,
})

```

Instead of keeping sessions in memory (which would be lost if the server restarts), I implemented a persistent session store:

Connect-pg-simple: Sessions are stored directly in the PostgreSQL database.

Security configuration: Cookies are configured with httpOnly, a long maxAge, and secure flags in production environments.

```js

app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax'
    }
}))

```
The user session is saved in the DB:

```sql

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)

```

I moved away from standard incremental IDs (1, 2, 3...) to use UUIDs (Universally Unique Identifiers):

It prevents attackers from guessing the total number of users or predicting the ID of the next resource.


```sql

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

```

For critical operations where multiple database updates are linked (like moving money), I implemented SQL Transactions using a dedicated client from the pool.

I used BEGIN and COMMIT to ensure that a set of operations (e.g., deleting a Pot and refunding the Balance) either succeeds entirely or fails entirely.

If an error occurs during the process (like a "Pot Not Found"), a ROLLBACK is triggered to revert any partial changes, maintaining a consistent state.

I used finally { client.release() } to ensure the database connection is always returned to the pool, preventing memory leaks and connection hangs.

```js

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


```



### Continued development

Learning from each challenge, I will continue to make website with JS and learning from different challenge from Front-end Mentor.


### Useful resources

- [Mozilla mdn](https://developer.mozilla.org/) - Very useful.
- [FreeCodeCamp](https://www.freecodecamp.org/) - I've been learning a lot.
- [Odin Project](https://www.theodinproject.com/) - To learn backend with projects.


## Author

- Frontend Mentor - [@Lo-deck](https://www.frontendmentor.io/profile/Lo-Deck)


## Acknowledgments

Thanks to Front-end Mentor and its community.
