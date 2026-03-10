
const db = require('../db/queries')




async function getBalanceDB (req, res) {

    // req.session.user = { id: user.id, name: user.name, email: user.email };

    const userId = req.session.user.id;

    try{

        const data = await db.queryBalance(userId)

        console.log('getBalanceDB data', data);
        

        return res.status(200).json({
            message: 'DB balance download successfully',
            balance: data,
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

        const data = await db.queryTransactions(userId)

        return res.status(200).json({
            message: 'DB balance transactions successfully',
            transactions: data,
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

        const data = await db.queryBudgets(userId)

        return res.status(200).json({
            message: 'DB balance budgets successfully',
            budgets: data,
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

        const data = await db.queryPots(userId)


        return res.status(200).json({
            message: 'DB balance pots successfully',
            pots: data,
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

        // console.log('getAllFinanceData balance, transactions, budgets, pots ', balance, transactions, budgets, pots);

        // console.log('getAllFinanceData balance ', balance);

        
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







module.exports = { getBalanceDB, getTransactionsDB, getBudgetsDB, getPotsDB, getAllFinanceData }

