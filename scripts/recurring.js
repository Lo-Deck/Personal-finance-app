


import { getData } from './data-service.js';

import { setupSideMenu, toggleSortMenu, closeAllSortMenu } from './ui-utils.js';



( async () => {

    try{

        setupSideMenu();

        const data = await getData.fetchData('../data.json');
        console.log(data);
        feedRecurringPage(data);

    } catch(error) {

        console.error('CRITICAL APP ERROR:', error.message);
        document.querySelector('.container-main').innerHTML = `
            <div class="error-message">
                <p>Oups ! Impossible de charger vos données.</p>
                <button onclick="location.reload()">Réessayer</button>
            </div>`; 

            //****************************ATTENTION INNER HTML******************

    }

})()



function feedRecurringPage(data){

    let paidBills = 0;
    let paid = 0;
    let totalUpcoming = 0;
    let upcoming = 0;
    let dueSoon = 0;
    let soon = 0;

    const recurringBill = new Map();

    data.transactions.sort( (a, b) => {
        const dayA = new Date(a.date).getDate();
        const dayB = new Date(b.date).getDate();
        return dayA - dayB;
    }).forEach( (transaction) => {
            if(transaction.recurring){
                recurringBill.set(transaction.name, transaction);
            }
    });

    // console.log(recurringBill);

    const totalBill = Array.from(recurringBill.values()).reduce( (acc, transaction) => {
        return acc + Math.abs(transaction.amount);
    }, 0);
    
    // console.log('totalBill: ', totalBill); 
    
    const currentDate = new Date('2024-08-19T00:00:00');
    const today = currentDate.getDate();
    const referenceDate = new Date(currentDate);
    const dayPlusFive = new Date(referenceDate);
    dayPlusFive.setDate(referenceDate.getDate() + 5);
    const daydueSoon = dayPlusFive.getDate();


    recurringBill.forEach( (bill, index) => {

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




    
    const fragmentBill = document.createDocumentFragment();
    const templateBill = document.querySelector('#template-transaction');
    const containerTransactions = document.querySelector('.container-transactions');

    recurringBill.forEach( (transaction) => {

        const clone = templateBill.content.cloneNode(true);

        if(transaction.avatar && transaction.avatar.startsWith('../')){
            clone.querySelector('.avatar').src = transaction.avatar;            
        }

        clone.querySelector('.cell-name .text').textContent = transaction.name; 
        clone.querySelector('.cell-amount .text').textContent = `$${Math.abs(transaction.amount).toFixed(2)}`;            

        let billDate = new Date(transaction.date).getDate();
        // console.log('billDate', billDate);

        let textDate;

        switch(billDate){

            case 1:
                textDate = `Monthly-${billDate}st`;
                break;

            case 2:
                textDate = `Monthly-${billDate}nd`;
                break;

            case 3:
                textDate = `Monthly-${billDate}rd`;
                break;

            default:
                textDate = `Monthly-${billDate}th`;
                break;

        }

        clone.querySelector('.cell-date time').textContent = textDate;        

        if(billDate <= today){
            clone.querySelector('.logo-paid').src = "../assets/images/icon-bill-paid.svg";
            // console.log(clone.querySelector('.cell-date time'));
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

    });

    containerTransactions.appendChild(fragmentBill);

}





/* LISTENER */

// const btnSort = document.querySelector('.button-sort');
// const listSort = document.querySelector('.list-sort');

// btnSort.addEventListener('click', () => {

//     const isActive = listSort.classList.toggle('active');
//     const caret = btnSort.querySelector('.caret');
//     caret.style.transform = isActive ? "rotate(180deg)" : "rotate(0deg)";
//     btnSort.setAttribute('aria-expanded', isActive);

// });



// btnSort.setAttribute('aria-expanded', 'true');  A METTRE ARIA LABEL BUTTON
// btnSort.setAttribute('aria-selected', 'true');  A METTRE ARIA LABEL LIST-SORT LI 




document.addEventListener('click', (event) => {

    const btnSort = event.target.closest('.button-sort');

    if(btnSort){

        toggleSortMenu(btnSort);

    } else {

        closeAllSortMenu();
        
    }



})