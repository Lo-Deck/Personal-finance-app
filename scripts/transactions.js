
import { getData } from './data-service.js';
import { setupSideMenu, toggleSortMenu, closeAllSortMenu, transactionSliceBy, createNavBar, choosePageNavbar, createListHTMLCategory } from './ui-utils.js';


let transactions;//keep the data transactions
let transactionsFilter;//keep the data transactions filtered
const containerNavPages = document.querySelector('.container-nav-pages');


( async () => {

    try{

        setupSideMenu();

        const data = await getData.fetchData('../data.json');

        transactions = data.transactions.sort( (a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        });

        feedTransactionPage(transactions);

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




function feedTransactionPage(transactions){


    const currentLiSort = document.querySelector('.search-field .list-sort.sort .li-sort.selected');
    const currentLiCategory = document.querySelector('.search-field .list-sort.category .li-sort.selected');

    transactionsFilter = transactionSliceBy(transactions, currentLiSort, currentLiCategory);
    containerNavPages.textContent = '';

    if(transactionsFilter.length > 10){
        createNavBar(containerNavPages, transactionsFilter.length);
    }



    // const categoryHTMLList = document.querySelector('.list-sort.category');
    // const categoryMapList = new Map();

    // transactionsFilter.forEach( (transaction, index) => {
    //     categoryMapList.set(transaction.category, transaction.category);
    // });


    // const categoryList = Array.from(categoryMapList.values());
    // console.log('categoryList', categoryList);

    // categoryList.forEach( (transaction) => {
    //     const li = document.createElement('li');
    //     li.classList.add('li-sort');
    //     li.setAttribute('role', 'option');
    //     li.setAttribute('aria-selected', 'false');
    //     li.setAttribute('data-category', `${transaction}`);
    //     li.textContent = `${transaction}`;
    //     categoryHTMLList.appendChild(li);
    // });


    createListHTMLCategory(transactionsFilter, false);
    

}




/* LISTENER */

document.addEventListener('click', (event) => {

    const btnSort = event.target.closest('.button-sort');
    const liSortBy = event.target.closest('.list-sort.sort .li-sort');
    const liCategory = event.target.closest('.list-sort.category .li-sort');
    const liPage = event.target.closest('.li-page');


    if(btnSort){

        //to have only one menu open
        const container = btnSort.closest('.container-sort');
        const targetList = container.querySelector('.list-sort');
        const isOpen = targetList.classList.contains('active');

        closeAllSortMenu();

        if (!isOpen) {
            toggleSortMenu(btnSort);
        }

    }
    else {
        closeAllSortMenu();
    }


    if( liSortBy || liCategory ){

        transactionsFilter = transactionSliceBy(transactions, liSortBy, liCategory);
        containerNavPages.textContent = '';

        if(transactionsFilter.length > 10){
            createNavBar(containerNavPages, transactionsFilter.length);
        }

    }

    if(liPage){
        choosePageNavbar(liPage, transactionsFilter);
    }

});





const searchByName = document.querySelector('input');

if(searchByName){

    searchByName.addEventListener('input', (event) => {

        transactionsFilter = transactionSliceBy(transactions, null, null);
        containerNavPages.textContent = '';
        
        if(transactionsFilter.length > 10){
            createNavBar(containerNavPages, transactionsFilter.length);
        }

    });

}
