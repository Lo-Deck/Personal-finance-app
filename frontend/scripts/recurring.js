
import { getData } from './data-service.js';
import { setupSideMenu, toggleSortMenu, closeAllSortMenu, billSortBy, goThroughFocus, sanitizeData } from './ui-utils.js';


let recurringBill;
let recurringBillSort;


( async () => {

    try{

        setupSideMenu();

        const data = await getData.fetchData('/finances/transactions');

        sanitizeData(data);

        //extract recurring bills data
        let recurringTransactions = data.transactions.filter(transaction => transaction.recurring);
        const sortBillMap = new Map();
        recurringTransactions.forEach( (transaction) => {
            sortBillMap.set(transaction.name, transaction);
        });
        recurringBill = Array.from(sortBillMap.values());

        //set page
        feedRecurringPage(recurringBill);

    } catch(error) {

        // console.error('CRITICAL APP ERROR:', error.message);
        // console.error('CRITICAL APP ERROR:', error.stack);

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



function feedRecurringPage(recurringBill){

    const currentLiSort = document.querySelector('.search-field .li-sort.selected');

    const totalBill = recurringBill.reduce( (acc, transaction) => {
        return acc + Math.abs(transaction.amount);
    }, 0);

    const currentDate = new Date('2024-08-19T00:00:00');
    const today = currentDate.getDate();

    const referenceDate = new Date(currentDate);
    const dayPlusFive = new Date(referenceDate);

    dayPlusFive.setDate(referenceDate.getDate() + 5);
    const daydueSoon = dayPlusFive.getDate();

    let paidBills = 0;
    let paid = 0;
    let totalUpcoming = 0;
    let upcoming = 0;
    let dueSoon = 0;
    let soon = 0;

    recurringBill.forEach( (bill) => {

        const billDate = new Date(bill.date).getDate();
        const amount = Math.abs(bill.amount);

        if(billDate <= today){
            paidBills += amount;
            paid++;
        } else {
            totalUpcoming += amount;
            upcoming++;
            if(billDate <= daydueSoon){
                dueSoon += amount;
                soon++;
            }
        }

    });

    const articleHeader = document.querySelector('.article-header');
    articleHeader.querySelector('.total-bill').textContent = `$${totalBill.toFixed(2)}`;    
    articleHeader.querySelector('.paid .price').textContent = `${paid}($${paidBills.toFixed(2)})`;
    articleHeader.querySelector('.upcoming .price').textContent = `${upcoming}($${totalUpcoming.toFixed(2)})`;
    articleHeader.querySelector('.due .price').textContent = `${soon}($${dueSoon.toFixed(2)})`;

    recurringBillSort = billSortBy(recurringBill, currentLiSort);

}



/* LISTENER */

document.addEventListener('click', (event) => {

    const btnOpenMenuSort = event.target.closest('.button-sort');
    const liSortBy = event.target.closest('.li-sort');

    if(btnOpenMenuSort){
        toggleSortMenu(btnOpenMenuSort);
    } else {
        closeAllSortMenu();
    }

    if(liSortBy){
        recurringBillSort = billSortBy(recurringBill, liSortBy);
    }

});




/***** INPUT *****/

const searchByName = document.querySelector('input');

if(searchByName){

    searchByName.addEventListener('input', (event) => {
        const liSortBy = document.querySelector('.li-sort.selected');
        recurringBillSort = billSortBy(recurringBill, liSortBy);
    });

}


/**** FOCUS ****/

goThroughFocus();

