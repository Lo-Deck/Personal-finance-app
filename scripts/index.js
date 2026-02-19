

import { getData } from './data-service.js';
import { setupSideMenu, createSVGChart } from './ui-utils.js';


( async () => {

    try{

        setupSideMenu();

        const [ balance, transactions, budgets, pots ] = await Promise.all([
            getData.fetchData('http://localhost:3000/balance'),
            getData.fetchData('http://localhost:3000/transactions'),
            getData.fetchData('http://localhost:3000/budgets'),
            getData.fetchData('http://localhost:3000/pots')
        ]);

        const data = {
            balance: balance,
            transactions: transactions,
            budgets: budgets,
            pots: pots
        };

        feedIndexPage(data);

    } catch(error) {

        console.error('CRITICAL APP ERROR:', error.message);
        console.error('CRITICAL APP ERROR:', error.stack);
        document.querySelector('.container-main').innerHTML = `
            <div class="error-message">
                <p style="font-size: 2rem; margin-top: 5rem; color: red;"> !!! Impossible to download data !!! </p>
                <button onclick="location.reload()" style="font-size: 2rem; margin-top: 1rem; padding: 0.5rem; border: 2px solid red; color: red;">Retry</button>
            </div>`; 

            //****************************ATTENTION INNER HTML SECURITY******************

    }

})()



function feedIndexPage(data){


    /* HEADER */

    const containerExpenses = document.querySelector('.container-expenses');

    if (containerExpenses) {
        containerExpenses.querySelector('.expenses.balance .amount').textContent = `$${data.balance.current.toFixed(2)}`;
        containerExpenses.querySelector('.expenses.income .amount').textContent = `$${data.balance.income.toFixed(2)}`;
        containerExpenses.querySelector('.expenses.expense .amount').textContent = `$${data.balance.expenses.toFixed(2)}`;
    }

    
    /* POTS */
     
    const potsTotalSaved = document.querySelector('.total-saved .text');
    const potsList = document.querySelector('.section-pots .list-pots');
    const potsElements = potsList.querySelectorAll('.li-pots');

    const totalSaved = data.pots.reduce( (acc, pot) => acc + pot.total, 0);
    if(potsTotalSaved) potsTotalSaved.textContent = `$${totalSaved}`;

    for(let i = 0; i < 4; i++){
        potsElements[i].querySelector('.border').style.backgroundColor = data.pots[i].theme;
        potsElements[i].querySelector('.text').textContent = data.pots[i].name;
        potsElements[i].querySelector('span').textContent = `$${data.pots[i].total}`;
    }


    /* TRANSACTIONS */

    const containerTransactions = document.querySelector('.container-transactions');
    const template = document.querySelector('#transaction-template');


    data.transactions.slice(0, 5).forEach( (transaction) => {

        const clone = template.content.cloneNode(true);
        clone.querySelector('.text').textContent = transaction.name;

        if (transaction.avatar.startsWith('../')) {
            clone.querySelector('.avatar').src = transaction.avatar;
            clone.querySelector('.avatar').alt = `Avatar de ${transaction.name}`;
        }

        if( transaction.amount >= 0 ){
            clone.querySelector('.price').textContent = `$${transaction.amount.toFixed(2)}`;
            clone.querySelector('.price').classList.add('plus');
        } else {
            clone.querySelector('.price').textContent = `-$${Math.abs(transaction.amount).toFixed(2)}`;
        }

        const formattedDate = new Date(transaction.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        clone.querySelector('.date').textContent = formattedDate;

        containerTransactions.appendChild(clone);

    })
    

    /* BUDGETS */

    const budgetAmountbyCategory = new Map();

    data.budgets.forEach( (budget) => {
        budgetAmountbyCategory.set(budget.category, 0);
    });

    data.transactions.forEach( (transaction) => {
        if(budgetAmountbyCategory.has(transaction.category)){
            const currentAmount = budgetAmountbyCategory.get(transaction.category);
            budgetAmountbyCategory.set(transaction.category, currentAmount + Math.abs(transaction.amount));
        }
    });


    //chart create SVG
    createSVGChart(data.budgets, budgetAmountbyCategory);

    //list
    const budgetCategories = data.budgets.map(budget => budget.category);
    const categorySet = new Set(budgetCategories);
   
    const amountByCategory = data.transactions.reduce( (acc, transaction) => {

        if (categorySet.has(transaction.category)) {
            return acc + transaction.amount;
        }
        return acc;

    }, 0);


    const budgetsTotal = document.querySelector('.section-budgets .text');
    const budgetsSpend = budgetsTotal.querySelector('.spend');
    const budgetsTotalSpend = budgetsTotal.querySelector('.total-spend');

    const totalSpend = data.budgets.reduce( (acc, budget) => acc + budget.maximum, 0);
    if(budgetsTotalSpend) budgetsTotalSpend.textContent = `of $${totalSpend} limit`;

    budgetsSpend.textContent = `$${Math.floor(Math.abs(amountByCategory))}`;

    const budgetsList = document.querySelector('.section-budgets .list-pots');
    const budgetsLiElements = budgetsList.querySelectorAll('.li-pots');

    for(let i = 0; i < 4; i++){
        budgetsLiElements[i].querySelector('.border').style.backgroundColor = data.budgets[i].theme;
        budgetsLiElements[i].querySelector('.text').textContent = data.budgets[i].category;
        budgetsLiElements[i].querySelector('span').textContent = `$${data.budgets[i].maximum.toFixed(2)}`;
    }


    /* RECURRING */

    let paidBills = 0;
    let totalUpcoming = 0;
    let dueSoon = 0;    

    let billRecurring = new Map();

    data.transactions.forEach( (transaction) => {
        if( transaction.recurring ){
            billRecurring.set(transaction.name, transaction);
        }
    });


    let currentDate = new Date("August 19, 2024");
    const today = currentDate.getDate();
    const referenceDate = new Date(currentDate);
    const dayPlusFive = new Date(referenceDate);
    dayPlusFive.setDate(referenceDate.getDate() + 5);
    const daydueSoon = dayPlusFive.getDate();
   

    billRecurring.forEach( (bill, index) => {

        const billDate = new Date(bill.date).getDate();
        const amount = Math.abs(bill.amount);

        if( billDate <= today ){
            paidBills += amount;
        } else {
            totalUpcoming += amount;
            if(billDate <= daydueSoon){
                dueSoon += amount;
            }
        }

    });

    const containerRecurring = document.querySelector('.article-recurring'); 
    const paid = containerRecurring.querySelector('.bills.paid .price');
    const upcoming = containerRecurring.querySelector('.bills.upcoming .price');
    const due = containerRecurring.querySelector('.bills.due .price');

    paid.textContent = `$${paidBills.toFixed(2)}`;
    upcoming.textContent = `$${totalUpcoming.toFixed(2)}`;
    due.textContent = `$${dueSoon.toFixed(2)}`;

}

