

const { Router } = require('express')
const router = Router()
const isAuth = require('../middleware/authMiddleware')
const { getBalanceDB, getTransactionsDB, getBudgetsDB, getPotsDB, getAllFinanceData, validBudget, addBudgets, deleteBudget, updateBudget, validPot, addPot, updatePot, deletePot, validAmount, updateMoneyPot, validId } = require('../controllers/financesController')


//get data for pages
router.get('/all', isAuth, getAllFinanceData)
router.get('/balance', isAuth, getBalanceDB)
router.get('/transactions', isAuth, getTransactionsDB)
router.get('/budgets', isAuth, getBudgetsDB)
router.get('/pots', isAuth, getPotsDB)


//add, edit, delete budget
router.post('/addNewBudget', isAuth, validBudget, addBudgets)
router.patch('/updateBudget/:id', isAuth, validId, validBudget, updateBudget)
router.delete('/deleteBudget/:id', isAuth, validId, deleteBudget)


//add, edit, delete pot
router.post('/addNewPot', isAuth, validPot, addPot)
router.patch('/updatePot/:id', isAuth, validId, validPot, updatePot)
router.delete('/deletePot/:id', isAuth, validId, deletePot)
router.patch('/updateMoneypot/:id', isAuth, validId, validAmount, updateMoneyPot)


module.exports = router
