
const db = require('../db/queries')

const { body, validationResult, matchedData } = require('express-validator')




const validBudget = [

    body('category').trim().notEmpty().escape(),

    body('maximum').trim()
            .notEmpty().withMessage('Amount is required')
            .isFloat({ min: 0.01, max: 99999999 }).withMessage('Must be a valid amount')
            .isLength({min:1, max: 8}).withMessage(`Input must be between 1 and 8 characters.`)
            .escape(),

    body('theme').trim().notEmpty().escape()

]






async function getBalanceDB (req, res) {

    const userId = req.session.user.id;

    try{

        const balance = await db.queryBalance(userId)
        return res.status(200).json({
            balance
        })

    } catch(error){

        return res.status(500).json({
            error: 'Server error: Unable to process registration.'
        })

    }

}



async function getTransactionsDB (req, res) {

    const userId = req.session.user.id;

    try{

        const transactions = await db.queryTransactions(userId);
        return res.status(200).json({
            transactions
        })


    } catch(error){

        return res.status(500).json({
            error: 'Unable to reach server.'
        })

    }

}



async function getBudgetsDB (req, res) {

    const userId = req.session.user.id;

    try{

        const budgets = await db.queryBudgets(userId)
        return res.status(200).json({
            budgets
        })

    } catch(error){

        return res.status(500).json({
            error: 'Unable to reach server.'
        })

    }

}



async function getPotsDB (req, res) {

    const userId = req.session.user.id;

    try{

        const pots = await db.queryPots(userId)
        return res.status(200).json({
            pots
        })

    } catch(error){

        return res.status(500).json({
            error: 'Unable to reach server.'
        })

    }

}



async function getAllFinanceData(req,res){

    const userId = req.session.user.id;

    try {
        const [balance, transactions, budgets, pots] = await Promise.all([
            db.queryBalance(userId),
            db.queryTransactions(userId),
            db.queryBudgets(userId),
            db.queryPots(userId)
        ]);

        return res.status(200).json({
            balance, 
            transactions,
            budgets,
            pots
        });

    } catch(error) {
        return res.status(500).json({ error: 'Erreur serveur' });
    }
    
}






async function addBudgets(req, res){

    const userId = req.session.user.id

    console.log('matchedData(req)', matchedData(req))

    const { category, maximum, theme } = matchedData(req)

    console.log('category, maximum, theme', category, maximum, theme)

    try{

        const newBudgets = await db.addBudget(userId, category, Number(maximum), theme)

        return res.status(200).json({
            message: 'Budget created with success',
            newBudgets
        })

    } catch(error) {
        return res.status(500).json({ error: 'Error server' });
    }

}




async function updateBudget(req, res){

    const userId = req.session.user.id
    const budgetId = req.params.id

    const { category, maximum, theme } = matchedData(req);

    try{

        const updatedBudget = await db.updateBudget(budgetId, userId, category, Number(maximum), theme);

        if (!updatedBudget) {
            return res.status(404).json({ error: "Budget not found" });
        }

        return res.status(200).json({
            message: 'Budget updated with success',
            updatedBudget
        })

    } catch(error) {
        return res.status(500).json({ error: 'Error server' });
    }

}







async function deleteBudget(req, res){

    const userId = req.session.user.id
    const budgetId = req.params.id

    try{

        const deletedBudgets = await db.deleteBudget(budgetId, userId)

        if (!deletedBudgets) {
            return res.status(404).json({ error: "Budget not found or unauthorized" });
        }

        return res.status(200).json({
            message: 'Budget deleted with success',
            deletedBudgets
        })

    } catch(error) {
        return res.status(500).json({ error: 'Error server' })
    }

}






module.exports = { getBalanceDB, getTransactionsDB, getBudgetsDB, getPotsDB, getAllFinanceData, validBudget, addBudgets, deleteBudget, updateBudget }

