

const { Router } = require('express')
const router = Router()

const { signupValidation, loginValidation, registerUser, loginUser, getMe } = require('../controllers/usersController')



router.post('/sign-up', signupValidation, registerUser)

router.post('/sign-in', loginValidation, loginUser)




router.get('/me', getMe)

/* 2. Pourquoi /me est ton traducteur

C'est là que /me intervient. Puisque seul le serveur peut lire ce cookie httpOnly, c'est le serveur qui doit regarder dedans pour savoir quel utilisateur il représente.

    Le navigateur envoie automatiquement le cookie avec chaque requête fetch.

    Le serveur reçoit la requête /me.

    Le middleware express-session ouvre le cookie, regarde dans ta table session de Postgres (où tu as stocké l'ID utilisateur au moment du login), et déballe les infos de l'utilisateur.

    Ta fonction getMe renvoie ces infos au Front. */





module.exports = router



