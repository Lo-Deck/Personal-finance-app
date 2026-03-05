


const db = require('../db/queries')

const bcrypt = require('bcryptjs')

const { body, validationResult, matchedData } = require('express-validator')



const mockData = require('../../frontend/data.json');



const signupValidation = [

    body('name').trim()
                .isLength({min:2, max: 30}).withMessage(`Last name must be between 2 and 30 characters.`)
                .escape(),


    body('email').trim()
                 .notEmpty().withMessage("Email is required.")
                 .isEmail().withMessage("Email must be properly formatted."),


    body('password').isLength({ min: 8, max: 50 }).withMessage('Password must be at leat 8 characters.'),

    body('confirmPassword')
        .custom( (value, { req }) => {

            if(value !== req.body.password){
                throw new Error('Passwords do not match')
            }

            return true

        }),


]


const loginValidation = [

    body("email").trim()
        .notEmpty().withMessage("Email is required.")
        .isEmail().withMessage("Email must be properly formatted."),

    body('password').isLength({ min: 8, max: 50 }).withMessage('Password must be at leat 8 characters.'),

]






async function registerUser (req, res) {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const errorMessage = errors.array()[0].msg
        return res.status(400).json({
            error: errorMessage,
            formData: req.body
        })
    }

    const { name, email, password } = matchedData(req)

    try{

        const hashedpasword = await bcrypt.hash(password, 10)
        const newUser = await db.createUser(name, email, hashedpasword)

        console.log('get newUser from DB in fonction registerUser ', newUser);
        

        //MockData
        await db.seedUserData(newUser.id, mockData);

        res.status(201).json({
            message: 'User created successfully',
            user: newUser
        })

    } catch(error) {

        /* VOIR DIFFERENT ERROR STATUS */

        if(error.code === '23505'){
            return res.status(409).json({ 
                error: 'Email already exists.', 
                formData: req.body 
            });
        }

        return res.status(500).json({
            error: 'Server error: Unable to process registration.',
            formData: req.body
        })

    }

}




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

            res.redirect('/')

            // return res.status(200).json({

            //     message: 'User login with success',
            //     userId: user.id,
            //     username: user.name,
            //     email: user.email

            // })

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


async function logOutUser(req, res){

    req.session.destroy( (error) => {

        if(error){
            return res.status(500).json({ error: 'Impossible to disconnect' })
        }

        res.clearCookie('connect.sid')

        return res.status(200).json({ message: 'Disconnected successfully' })

    })

}


async function getMe(req, res){

    if(req.session && req.session.user){
        res.json({
            loggedIn: true,
            user: req.session.user
        })
    }
    else{
        res.status(401).json({ loggedIn: false, error: "Not authorized" })
    }

}



module.exports = { signupValidation, loginValidation, registerUser, loginUser, logOutUser, getMe }
