
import { getData } from './data-service.js';
import { setupSideMenu, toggleSortMenu, closeAllSortMenu, transactionSliceBy, createNavBar, choosePageNavbar, createListHTMLCategory, goThroughFocus, sanitizeData } from './ui-utils.js';


let transactions;//keep the data transactions
let transactionsFilter;//keep the data transactions filtered
const containerNavPages = document.querySelector('.container-nav-pages');


( async () => {

    try{

        setupSideMenu();


        // const data = {
        //     // transactions: await getData.fetchData('http://localhost:3000/transactions')
        //     transactions: await getData.fetchData('/finances/transactions')

        // };

        const data = await getData.fetchData('/finances/transactions');

        console.log('data before sanitize', data);

        sanitizeData(data);


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

    const cat = new URLSearchParams(window.location.search);

    let extractCategory = cat.get('cat');

    if(!extractCategory){
    
        extractCategory = 'All Transactions'; 
        const url = new URL(location);     
        console.log('url', url);
        url.searchParams.set("cat", extractCategory);
        history.replaceState({}, "", url);

    }

    createListHTMLCategory(transactions, false);

    const currentLiSort = document.querySelector('.search-field .list-sort.sort .li-sort.selected');
    let currentLiCategory;

    if(extractCategory){

        document.querySelectorAll('.list-sort.category .li-sort').forEach( (li) => {
            if( li.dataset.category === extractCategory){
                currentLiCategory = li;
            }
        });

    }
    else{
        currentLiCategory = document.querySelector('.search-field .list-sort.category .li-sort.selected');    
    }

    transactionsFilter = transactionSliceBy(transactions, currentLiSort, currentLiCategory);

    containerNavPages.textContent = '';
    if(transactionsFilter.length > 10){
        createNavBar(containerNavPages, transactionsFilter.length);
    }

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
            targetList.querySelector('.li-sort.selected').setAttribute('tabindex', '0');
        }
        else{
            targetList.querySelector('.li-sort.selected').setAttribute('tabindex', '-1');
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

        if(liSortBy){
            liSortBy.setAttribute('tabindex', '0');
        }

        if(liCategory){

            const extractCategory = liCategory.dataset.category;

            if(extractCategory){
                const url = new URL(location);
                console.log('url', url);
                url.searchParams.set("cat", extractCategory);
                history.replaceState({}, "", url);
            }

            liCategory.setAttribute('tabindex', '0');

        }

    }

    if(liPage){
        choosePageNavbar(liPage, transactionsFilter);
    }

});



/* INPUT */

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




/**** FOCUS ****/

goThroughFocus();


