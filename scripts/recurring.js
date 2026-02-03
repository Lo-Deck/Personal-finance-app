

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
    // const dataSort = currentLiSort.dataset.sort;

    const totalBill = recurringBill.reduce( (acc, transaction) => {
        return acc + Math.abs(transaction.amount);
    }, 0);

    // console.log('totalBill: ', totalBill); 
    
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


    // const searchByName = event.target.closest('input');


    if(btnOpenMenuSort){
        toggleSortMenu(btnOpenMenuSort);
    } else {
        closeAllSortMenu();
    }

    if(liSortBy){
        console.log('SORT BY');
        recurringBillSort = billSortBy(recurringBill, liSortBy);
    }




});



const searchByName = document.querySelector('input');
let wordInput;


if(searchByName){

    console.log('searchByName', searchByName);

    searchByName.addEventListener('input', (event) => {

        wordInput = event.target.value.toLowerCase();
        // console.log('wordInput', wordInput);

        const lengthWord = wordInput.length;

        // console.log('lengthWord', lengthWord);
        // console.log('recurringBillSort', recurringBillSort);



        const currentDate = new Date('2024-08-19T00:00:00');
        const today = currentDate.getDate();
        const referenceDate = new Date(currentDate);
        const dayPlusFive = new Date(referenceDate);
        dayPlusFive.setDate(referenceDate.getDate() + 5);
        const daydueSoon = dayPlusFive.getDate();


        const containerTransactions = document.querySelector('.append-transactions');
        const fragmentBill = document.createDocumentFragment();
        const templateBill = document.querySelector('#template-transaction');


        containerTransactions.textContent = '';



        recurringBillSort.forEach( (transaction) => {

            const wordToCompare = transaction.name.toLowerCase().slice(0, lengthWord);
            // console.log('wordInput', wordInput, ', wordToCompare', wordToCompare, ' of ', transaction.name);

            const resultCompare = wordInput.localeCompare(wordToCompare);
            // console.log('resultCompare : ', resultCompare);
            // console.log('wordToCompare.length : ', wordToCompare.length);
            // console.log('wordToCompare : ', wordToCompare);

            if(resultCompare !== 0 && wordToCompare.length === 0){ // when you delete all the text in the input 
                wordInput = transaction.name;
                wordToCompare = transaction.name;
                // console.log('wordInput', wordInput, 'wordToCompare', wordToCompare);
            }

            if(wordInput ===  wordToCompare){

                // const currentDate = new Date('2024-08-19T00:00:00');
                // const today = currentDate.getDate();
                // const referenceDate = new Date(currentDate);
                // const dayPlusFive = new Date(referenceDate);
                // dayPlusFive.setDate(referenceDate.getDate() + 5);
                // const daydueSoon = dayPlusFive.getDate();


                // containerTransactions.textContent = '';

                const clone = templateBill.content.cloneNode(true);

                if(transaction.avatar && transaction.avatar.startsWith('../')){
                    clone.querySelector('.avatar').src = transaction.avatar;            
                }

                clone.querySelector('.cell-name .text').textContent = transaction.name; 
                clone.querySelector('.cell-amount .text').textContent = `$${Math.abs(transaction.amount).toFixed(2)}`;            


                //set suffix st, nd, th 
                let billDate = new Date(transaction.date).getDate();

                const suffixes = [ 'st', 'nd', 'rd' ];
                let suffix;

                const date = billDate.toString().split('');

                if(date.length === 1){
                    date.unshift('0');
                }

                suffix = date[0] !== '1' ? suffixes[Number(date[1])-1] || 'th' : 'th' ;
                const textDate = `Monthly-${billDate}${suffix}`;
                clone.querySelector('.cell-date time').textContent = textDate;

                //set text
                if(billDate <= today){
                    clone.querySelector('.logo-paid').src = "../assets/images/icon-bill-paid.svg";
                    clone.querySelector('.cell-date time').classList.add('green');
                }
                else if(billDate <= daydueSoon){
                    clone.querySelector('.logo-paid').src="../assets/images/icon-bill-due.svg";              
                    clone.querySelector('.cell-amount .text').classList.add('red');
                }
                else {
                    clone.querySelector('.logo-paid').style.display = "none";
                }

                fragmentBill.appendChild(clone);

            }

        });

        containerTransactions.appendChild(fragmentBill);
        
    });
    

}



