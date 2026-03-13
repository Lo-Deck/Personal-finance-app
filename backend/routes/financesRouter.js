

const { Router } = require('express')
const router = Router()
const isAuth = require('../middleware/authMiddleware')
const { getBalanceDB, getTransactionsDB, getBudgetsDB, getPotsDB, getAllFinanceData, validBudget, addBudgets, deleteBudget, updateBudget, validPot, addPot, updatePot, deletePot, validAmount, updateMoneyPot } = require('../controllers/financesController')


//get data for pages
router.get('/all', isAuth, getAllFinanceData)
router.get('/balance', isAuth, getBalanceDB)
router.get('/transactions', isAuth, getTransactionsDB)
router.get('/budgets', isAuth, getBudgetsDB)
router.get('/pots', isAuth, getPotsDB)


//add, edit, delete budget
router.post('/addNewBudget', isAuth, validBudget, addBudgets)
router.patch('/updateBudget/:id', isAuth, validBudget, updateBudget)
router.delete('/deleteBudget/:id', isAuth, deleteBudget)


//add, edit, delete pot
router.post('/addNewPot', isAuth, validPot, addPot)
router.patch('/updatePot/:id', isAuth, validPot, updatePot)
router.delete('/deletePot/:id', isAuth, deletePot)
router.patch('/updateMoneypot/:id', isAuth, validAmount, updateMoneyPot)


module.exports = router
