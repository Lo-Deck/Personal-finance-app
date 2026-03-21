

const { Router } = require('express')
const router = Router()


const rateLimit = require('express-rate-limit')

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Too many connexion attempts, try again in an hour.',
  standardHeaders: true,
  legacyHeaders: false,
})


const { signupValidation, loginValidation, registerUser, loginUser, logOutUser, deleteUser, getMe } = require('../controllers/usersController')



router.post('/sign-up', authLimiter, signupValidation, registerUser)
router.post('/sign-in', authLimiter, loginValidation, loginUser)
router.post('/log-out', logOutUser)


router.delete('/delete-user', deleteUser)



router.get('/me', getMe)



module.exports = router

