
import { getData, sendData } from './data-service.js';
import { setupSideMenu, createSVGChart, goThroughFocus, sanitizeData, logout, displayPopup } from './ui-utils.js';


( async () => {

    try{

        setupSideMenu();

        const dataFromServer = await getData.fetchData('/finances/all');

        sanitizeData(dataFromServer);

        const data = {
            balance: dataFromServer.balance[0],
            transactions: dataFromServer.transactions,
            budgets: dataFromServer.budgets,
            pots: dataFromServer.pots
        };


        // console.log('AVANT feedIndexPage data: ', data);
        
        feedIndexPage(data);

    } catch(error) {

        console.error('CRITICAL APP ERROR:', error.message);
        console.error('CRITICAL APP ERROR:', error.stack);
        console.log('Message ERROR SERVER', error);
        
        const container = document.querySelector('.container-main');
        container.innerHTML = '';
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';

        const p = document.createElement('p');
        p.textContent = '!!! Impossible to download data !!!';
        p.style.fontSize = '2rem';
        p.style.marginTop = '5rem';
        p.style.color = 'red';

        const button = document.createElement('button');
        button.textContent = 'Retry';
        button.style.fontSize = '2rem';
        button.style.marginTop = '1rem';
        button.style.padding = '0.5rem';
        button.style.border = '2px solid red';
        button.style.color = 'red';
        button.onclick = () => location.reload();

        errorDiv.appendChild(p);
        errorDiv.appendChild(button);
        container.appendChild(errorDiv);


    }

})()



function feedIndexPage(data){


    /* HEADER */

    const containerExpenses = document.querySelector('.container-expenses');

    // console.log('feedIndexPage data.balance ', data.balance);
    // console.log('feedIndexPage data.balance.current ', data.balance.current);
    
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
            return acc + Math.abs(transaction.amount);
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


/*LISTENER*/

const userOptions = document.querySelector('.list-options');
const modalLogout = document.querySelector('.modal-logout');
const modalDelete = document.querySelector('.modal-delete-user');

document.addEventListener('click', async (event) => {

    const btnUserOptions = event.target.closest('.container-logout');
    const btnDeleteUser = event.target.closest('.delete-user');
    const btnLogout = event.target.closest('.link-logout');

    // if(btnUserOptions && !btnDeleteUser && !btnLogout){
    if(btnUserOptions){
        // console.log("OPTIONS");
        userOptions.classList.toggle('active');
    }
    else{
        userOptions.classList.remove('active');
    }

    if(btnDeleteUser){
        // console.log("deleteUser");
        event.preventDefault();
        modalDelete.showModal();
    }

    if(btnLogout){
        // console.log("logout");
        event.preventDefault();
        modalLogout.showModal();
    }

});


/* SUBMIT */

const formUserLogout = document.querySelector('#user-logout');

formUserLogout.addEventListener('submit', async (event) => {

    event.preventDefault();
    // event.stopPropagation();
    // logout();

    modalLogout.close();

    try {
        const response = await fetch('/users/log-out', {
            method: 'POST'
        });

        if (response.ok) {
            window.location.href = '/sign-in';
        }
    } catch (error) {
        console.error('Logout failed', error);
    }

});





const formUserDelete = document.querySelector('#user-delete');

formUserDelete.addEventListener('submit', async (event) => {

    event.preventDefault();

    modalDelete.close();

    try {

        const deletedUser = await sendData(`/users/delete-user`, null, 'DELETE');
        // const deletedUser = null;


        if(deletedUser){
            window.location.href = '/sign-up';
        }
        else{
            throw Error('Impossible to delete user')
        }

    } catch (error) {
        console.error('Delete user failed', );
        displayPopup('Delete user', 'This action has failed', "red");
    }

});




/**** FOCUS ****/

goThroughFocus();


// logout();




