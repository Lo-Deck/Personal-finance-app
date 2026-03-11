

const { Router } = require('express')
const router = Router()
const isAuth = require('../middleware/authMiddleware')
const { getBalanceDB, getTransactionsDB, getBudgetsDB, getPotsDB, getAllFinanceData, validBudget, addBudgets, deleteBudget, updateBudget } = require('../controllers/financesController')



router.get('/all', isAuth, getAllFinanceData)

router.get('/balance', isAuth, getBalanceDB)

router.get('/transactions', isAuth, getTransactionsDB)

router.get('/budgets', isAuth, getBudgetsDB)

router.get('/pots', isAuth, getPotsDB)





router.post('/addNewBudget', isAuth, validBudget, addBudgets)

router.patch('/updateBudget/:id', isAuth, validBudget, updateBudget)

router.delete('/budgets/:id', isAuth, deleteBudget);



/* |FAIRE DE MEME AVEC POST ROUTE CONTROLLER QUERIES */


module.exports = router
