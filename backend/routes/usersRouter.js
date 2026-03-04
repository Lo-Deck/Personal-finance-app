

const { Router } = require('express')
const router = Router()


const { signupValidation, loginValidation, registerUser, loginUser } = require('../controllers/userController')

// const path = require('path')



router.post('/sign-up', signupValidation, registerUser)


router.post('/sign-in', loginValidation, loginUser)

