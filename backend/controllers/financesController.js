
const db = require('../db/queries')

const { body, validationResult, matchedData } = require('express-validator')




const validBudget = [

    body('category').trim().notEmpty().escape(),

    body('maximum').trim()
            .notEmpty().withMessage('Amount is required')
            .isFloat({ min: 0.01, max: 99999999 }).withMessage('Must be a valid amount')
            .isLength({min:1, max: 10}).withMessage(`Input must be between 1 and 10 characters.`)
            .escape(),

    body('theme').trim().notEmpty().escape()

]





const validPot = [

    body('name').trim()
                .notEmpty().withMessage('Pot name is required')
                .isLength({min:2, max: 30}).withMessage(`Pot name must be between 2 and 30 characters.`)
                .escape(),

    body('target').trim()
            .notEmpty().withMessage('Amount is required')
            .isFloat({ min: 0.01, max: 99999999 }).withMessage('Must be a valid amount')
            .isLength({min:1, max: 10}).withMessage(`Input must be between 1 and 10 characters.`)
            .escape(),

    body('theme').trim().notEmpty().escape()

]


const validAmount = [

    body('amount').trim()
        .notEmpty().withMessage('Amount is required')
        .isFloat({ min: -99999999, max: 99999999 }).withMessage('Must be a valid amount')
        .isLength({min:1, max: 10}).withMessage(`Input must be between 1 and 10 characters.`)
        .escape(),

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
        return res.status(500).json({ error: 'Erreur serveur' })
    }
    
}




//budgets

async function addBudgets(req, res){

    const userId = req.session.user.id


    const errors = validationResult(req)

    if(!errors.isEmpty()){
        const errorMessage = errors.array()[0].msg
        return res.status(400).json({
            error: errorMessage,
            formData: req.body
        })
    }

    
    const { category, maximum, theme } = matchedData(req)

    try{

        const newBudgets = await db.addBudget(userId, category, Number(maximum), theme)

        if (!newBudgets) {
            return res.status(404).json({ error: "Budget not created" })
        }

        return res.status(200).json({
            message: 'Budget created with success',
            newBudgets
        })

    } catch(error) {
        return res.status(500).json({ error: 'Error server' })
    }

}


async function updateBudget(req, res){

    const userId = req.session.user.id
    const budgetId = req.params.id


    const errors = validationResult(req)

    if(!errors.isEmpty()){
        const errorMessage = errors.array()[0].msg
        return res.status(400).json({
            error: errorMessage,
            formData: req.body
        })
    }


    const { category, maximum, theme } = matchedData(req);

    try{

        const updatedBudget = await db.updateBudget(budgetId, userId, category, Number(maximum), theme);

        if (!updatedBudget) {
            return res.status(404).json({ error: "Budget not found" })
        }

        return res.status(200).json({
            message: 'Budget updated with success',
            updatedBudget
        })

    } catch(error) {
        return res.status(500).json({ error: 'Error server' })
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



//pots

async function addPot(req, res){

    const userId = req.session.user.id


    const errors = validationResult(req)

    if(!errors.isEmpty()){
        const errorMessage = errors.array()[0].msg
        return res.status(400).json({
            error: errorMessage,
            formData: req.body
        })
    }


    const { name, target, theme } = matchedData(req)

    try{

        const newPot = await db.addPot(userId, name, Number(target), theme)

        if (!newPot) {
            return res.status(404).json({ error: "Pot not created" })
        }

        return res.status(200).json(
            // message: 'Pot created with success',
            newPot
        )

    } catch(error) {
        return res.status(500).json({ error: 'Error server' })
    }

}



async function updatePot(req, res){

    const userId = req.session.user.id
    const potId = req.params.id


    const errors = validationResult(req)

    if(!errors.isEmpty()){
        const errorMessage = errors.array()[0].msg
        return res.status(400).json({
            error: errorMessage,
            formData: req.body
        })
    }

    const { name, target, theme } = matchedData(req)

    try{

        const updatedPot = await db.updatePot(potId, userId, name, Number(target), theme)

        if (!updatedPot) {
            return res.status(404).json({ error: "Pot not found" })
        }

        return res.status(200).json(
            // message: 'Pot updated with success',
            updatedPot
        )

    } catch(error) {
        return res.status(500).json({ error: 'Error server' });
    }

}



async function deletePot(req, res){

    const userId = req.session.user.id
    const potId = req.params.id

    try{

        const deletedPot = await db.deletePot(potId, userId)

        if (!deletedPot) {
            return res.status(404).json({ error: "Budget not found or unauthorized" });
        }

        return res.status(200).json(
            // message: 'Budget deleted with success',
            deletedPot
        )

    } catch(error) {
        return res.status(500).json({ error: 'Error server' })
    }

}






async function updateMoneyPot(req, res){

    const userId = req.session.user.id
    const potId = req.params.id


    const errors = validationResult(req)

    if(!errors.isEmpty()){
        const errorMessage = errors.array()[0].msg
        return res.status(400).json({
            error: errorMessage,
            formData: req.body
        })
    }


    const { amount } = matchedData(req)

    console.log('BEFORE SEND TO DB amount ', amount);
    

    try{

        const updatedMoneyPot = await db.updateMoneyPot(Number(amount), potId, userId)

        if (!updatedMoneyPot) {
            return res.status(404).json({ error: "Pot not found" })
        }

        console.log('SEND TO FRONT  updatedMoneyPot', updatedMoneyPot);
        
        return res.status(200).json(
            updatedMoneyPot
        )

    } catch(error) {
        // return res.status(500).json({ error: 'Error server' });
        return res.status(500).json({ error: error.message });
    }

}





module.exports = { getBalanceDB, getTransactionsDB, getBudgetsDB, getPotsDB, getAllFinanceData, validBudget, addBudgets, deleteBudget, updateBudget, validPot, addPot, updatePot, deletePot, validAmount, updateMoneyPot }

