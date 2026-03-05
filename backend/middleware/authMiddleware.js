

const isAuth = (req, res, next) => {

    if(req.session && req.session.user){
        next()
    }

    else  {
        // res.status(401).json({ error: 'You need to be connected'})
        res.redirect('/login')

    }

}


module.exports = isAuth;