

import { getData } from './data-service.js';
import { setupSideMenu, toggleSortMenu, closeAllSortMenu, billSortBy } from './ui-utils.js';





let data;
let recurringBill;


let recurringBillSort;


( async () => {

    try{

        setupSideMenu();

        data = await getData.fetchData('../data.json');

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



const searchByName = document.querySelector('input');
let wordInput;


if(searchByName){

    const liSortBy = document.querySelector('.li-sort');

    searchByName.addEventListener('input', (event) => {

        console.log('***************************');
        console.log('searchByName', searchByName);

        recurringBillSort = billSortBy(recurringBill, liSortBy);

    });
    

}



