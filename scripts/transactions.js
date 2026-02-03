
import { getData } from './data-service.js';
import { setupSideMenu, toggleSortMenu, closeAllSortMenu, transactionSliceBy, createNavBar, choosePageNavbar } from './ui-utils.js';


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

        // transactions = data.transactions;

        // console.log(data);
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

    // console.log('feedpage: ', currentLiSort);
    // console.log('feedpage: ', currentLiCategory);
    // console.log(transactions);


    transactionsFilter = transactionSliceBy(transactions, currentLiSort, currentLiCategory);

    containerNavPages.textContent = '';

    if(transactionsFilter.length > 10){

        // console.log('NAVBAR ');

        console.log('transactionsFilter length', transactionsFilter.length);

        createNavBar(containerNavPages, transactionsFilter.length);

    }
    




    /************************************/
    /********  VOIR .slice().forEach le sortir de la fonction et creer propre fonction
     *  APRES FAIRE SELECTION AVEC INPUT ET CHOOSEPAGENAVBAR VOIR NUMBER PAGE = 5 METTRE NOMBRE DYNAMIQUE ************/
    





    
        // ul.addEventListener('click', (event) => {

        //     const button = event.target.closest('.button');
        //     const currentPage = ul.querySelector('.active .button').getAttribute('data-page');

        //     if(button){

        //         const dataPage = button.getAttribute('data-page') ?? "1";
        //         let numberPage;

        //         if(dataPage !== null){
        //             if( isNaN(Number(dataPage)) ){
        //                 numberPage = dataPage === 'next' ? Number(currentPage) + 1 : Number(currentPage) - 1;
        //             } else {
        //                 numberPage = Number(dataPage); 
        //             }
        //         }
   
        //         ul.querySelectorAll('.li-page')[currentPage].classList.remove('active');
        //         ul.querySelectorAll('.li-page')[numberPage].classList.add('active');

        //         if( numberPage !== 1 || numberPage !== 5 ){
        //             ul.querySelectorAll('.li-page')[0].classList.remove('disabled');
        //             ul.querySelectorAll('.li-page')[0].querySelector('.button').disabled = false;
        //             ul.querySelectorAll('.li-page')[6].classList.remove('disabled');
        //             ul.querySelectorAll('.li-page')[6].querySelector('.button').disabled = false;
        //         }

        //         if(numberPage === 1){
        //             ul.querySelectorAll('.li-page')[0].classList.add('disabled');
        //             ul.querySelectorAll('.li-page')[0].querySelector('.button').disabled = true;
        //         }

        //         if(numberPage === 5){
        //             ul.querySelectorAll('.li-page')[6].classList.add('disabled');
        //             ul.querySelectorAll('.li-page')[6].querySelector('.button').disabled = true;
        //         }

        //         if( numberPage ){

        //             transactions.slice( (numberPage-1) * 10 , (numberPage) * 10 ).forEach( (transaction, index) => {

        //                 const clone = templateTransaction.content.cloneNode(true);
        //                 if(transaction.avatar && transaction.avatar.startsWith('../')){
        //                     clone.querySelector('.avatar').src = transaction.avatar;            
        //                 }
        //                 clone.querySelector('.cell-name .text').textContent = transaction.name; 
        //                 clone.querySelector('.cell-amount .text').textContent = `$${Math.abs(transaction.amount).toFixed(2)}`;
        //                 const transactionDate = new Date(transaction.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        //                 clone.querySelector('.cell-date time').textContent = transactionDate;        
        //                 fragmentTransaction.appendChild(clone);

        //             });         
        //             containerTemplateTransactions.innerHTML='';
        //             containerTemplateTransactions.appendChild(fragmentTransaction);
        //         }     
        //         console.log('ul.querySelectorAll: ', ul.querySelectorAll('.li-page'));
        //     }
        // });








}




/* LISTENER */

document.addEventListener('click', (event) => {

    const btnSort = event.target.closest('.button-sort');
    const liSortBy = event.target.closest('.list-sort.sort .li-sort');
    const liCategory = event.target.closest('.list-sort.category .li-sort');
    const liPage = event.target.closest('.li-page');



    const searchByName = event.target.closest('input');


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
       
            console.log('lengthData', transactionsFilter.length);

            console.log('transactionsFilter liPage :', transactionsFilter);

            createNavBar(containerNavPages, transactionsFilter.length);

        }

    }


    if(liPage){

        console.log('************CLICK ON PAGE************');     
        console.log('transactionsFilter liPage :', transactionsFilter);
        choosePageNavbar(liPage, transactionsFilter);
        
    }


    if(searchByName){

        console.log('searchByName', searchByName);
        

    }


});


