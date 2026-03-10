

const { Router } = require('express')

const router = Router()

const isAuth = require('../middleware/authMiddleware')

const { getBalanceDB, getTransactionsDB, getBudgetsDB, getPotsDB, getAllFinanceData } = require('../controllers/financesController')





router.get('/all', isAuth, getAllFinanceData);

router.get('/balance', isAuth, getBalanceDB)

router.get('/transactions', isAuth, getTransactionsDB)

router.get('/budgets', isAuth, getBudgetsDB)

router.get('/pots', isAuth, getPotsDB)



// router.post()

module.exports = router
