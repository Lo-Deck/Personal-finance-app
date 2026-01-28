

import { getData } from './data-service.js';

import { setupSideMenu, toggleSortMenu, closeAllSortMenu } from './ui-utils.js';



( async () => {

    try{

        setupSideMenu();

        const data = await getData.fetchData('../data.json');
        // console.log(data);
        feedTransactionPage(data);

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




function feedTransactionPage(data){

    const transactions = data.transactions.sort( (a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });

    // console.log(transactions);

    const fragmentTransaction = document.createDocumentFragment();
    const templateTransaction = document.querySelector('#template-transaction');
    const containerTemplateTransactions = document.querySelector('.container-template-transactions');
    const containerTransactions = document.querySelector('.container-transactions');

    transactions.slice(0, 10).forEach( (transaction, index) => {

        const clone = templateTransaction.content.cloneNode(true);

        if(transaction.avatar && transaction.avatar.startsWith('../')){
            clone.querySelector('.avatar').src = transaction.avatar;            
        }

        clone.querySelector('.cell-name .text').textContent = transaction.name; 
        clone.querySelector('.cell-amount .text').textContent = `$${Math.abs(transaction.amount).toFixed(2)}`;

        const transactionDate = new Date(transaction.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        clone.querySelector('.cell-date time').textContent = transactionDate;        

        fragmentTransaction.appendChild(clone);

    });

    containerTemplateTransactions.appendChild(fragmentTransaction);



    if(transactions.length > 10){

        // console.log('**transactions.length > 10 ');

        //create nav
        var nav = document.createElement('nav');
        nav.classList.add('pages');
        nav.setAttribute('aria-label', 'pagination');

        //create ul
        const ul = document.createElement('ul');
        nav.appendChild(ul);       
        ul.classList.add('list', 'list-pages', 'public-sans-regular');

        //create li
        const liPrevious = document.createElement('li');
        liPrevious.classList.add('li-page', 'previous', 'disabled');
        liPrevious.innerHTML = `<button type="button" class="button previous" aria-label="page previous" data-page="previous" disabled="true"><svg fill="none" height="11" viewBox="0 0 6 11" width="6" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                                                                                      <path d="m5.14656 10.8535-5.000005-4.99997c-.046488-.04643-.0833676-.10158-.1085298-.16228-.0251623-.06069-.03811269-.12576-.0381127-.19147 0-.0657.0129504-.13077.0381126-.19147.0251623-.06069.0620419-.11584.1085299-.16228l4.999995-4.999997c.06993-.0700052.15906-.117689.2561-.13701419.09704-.01932521.19764-.0094229.28905.02845329.09141.0378763.16953.1020229.22447.1843199.05493.082297.08421.179044.08414.277991v10.000017c.00007.0989-.02921.1957-.08414.278-.05494.0823-.13306.1464-.22447.1843s-.19201.0478-.28905.0284c-.09704-.0193-.18617-.067-.25609-.137z"/>
                                                                                                                    </svg><span>Prev</span></button>`;
        ul.appendChild(liPrevious);

        for(let i = 0; i < Math.ceil(transactions.length / 10); i++){
            const li = document.createElement('li');
            i === 0 ? li.classList.add('li-page', 'active') : li.classList.add('li-page');
            li.innerHTML = `<button type="button" class="button button-page" aria-label="Page ${i+1}" data-page="${i+1}">${i+1}</button>`;
            ul.appendChild(li)
        }

        const liNext = document.createElement('li');
        liNext.classList.add('li-page', 'next');
        liNext.innerHTML = `<button type="button" class="button next" aria-label="page next" data-page="next"><span>Next</span><svg fill="none" height="11" viewBox="0 0 6 11" width="6" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                                                                          <path d="m.853506.146465 5.000004 5.000005c.04648.04643.08336.10158.10853.16228.02516.06069.03811.12576.03811.19147 0 .0657-.01295.13077-.03811.19147-.02517.06069-.06205.11584-.10853.16228l-5.000004 5.00003c-.069927.07-.159054.1177-.256097.137-.097042.0193-.197637.0094-.289048-.0285-.091412-.0378-.16953-.102-.2244652-.1843-.0549354-.0823-.08421767-.179-.08413981-.278l-.00000043-9.999984c-.00007788-.098949.02920444-.195695.08413984-.277992.0549356-.082297.1330536-.1464431.2244646-.1843193.091412-.03787611.192007-.04777907.289049-.02845381.097042.01932521.186169.06700801.256097.13701411z"/>
                                                                                                        </svg></button>`;
        ul.appendChild(liNext);    

        containerTransactions.appendChild(nav);


        //create listener

        ul.addEventListener('click', (event) => {

            const button = event.target.closest('.button');
            const currentPage = ul.querySelector('.active .button').getAttribute('data-page');

            if(button){

                const dataPage = button.getAttribute('data-page') ?? "1";
                let numberPage;

                if(dataPage !== null){
                    if( isNaN(Number(dataPage)) ){
                        numberPage = dataPage === 'next' ? Number(currentPage) + 1 : Number(currentPage) - 1;
                    } else {
                        numberPage = Number(dataPage); 
                    }
                }
   
                ul.querySelectorAll('.li-page')[currentPage].classList.remove('active');
                ul.querySelectorAll('.li-page')[numberPage].classList.add('active');


                if( numberPage !== 1 || numberPage !== 5 ){
                    ul.querySelectorAll('.li-page')[0].classList.remove('disabled');
                    ul.querySelectorAll('.li-page')[0].querySelector('.button').disabled = false;
                    ul.querySelectorAll('.li-page')[6].classList.remove('disabled');
                    ul.querySelectorAll('.li-page')[6].querySelector('.button').disabled = false;
                }

                if(numberPage === 1){
                    ul.querySelectorAll('.li-page')[0].classList.add('disabled');
                    ul.querySelectorAll('.li-page')[0].querySelector('.button').disabled = true;
                }

                if(numberPage === 5){
                    ul.querySelectorAll('.li-page')[6].classList.add('disabled');
                    ul.querySelectorAll('.li-page')[6].querySelector('.button').disabled = true;
                }


                if( numberPage ){

                    transactions.slice( (numberPage-1) * 10 , (numberPage) * 10 ).forEach( (transaction, index) => {

                        const clone = templateTransaction.content.cloneNode(true);

                        if(transaction.avatar && transaction.avatar.startsWith('../')){
                            clone.querySelector('.avatar').src = transaction.avatar;            
                        }

                        clone.querySelector('.cell-name .text').textContent = transaction.name; 
                        clone.querySelector('.cell-amount .text').textContent = `$${Math.abs(transaction.amount).toFixed(2)}`;

                        const transactionDate = new Date(transaction.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                        clone.querySelector('.cell-date time').textContent = transactionDate;        

                        fragmentTransaction.appendChild(clone);

                    });         

                    containerTemplateTransactions.innerHTML='';
                    containerTemplateTransactions.appendChild(fragmentTransaction);

                }     
                
                console.log('ul.querySelectorAll: ', ul.querySelectorAll('.li-page'));

            }

        });
        
    }

}










/* LISTENER */

document.addEventListener('click', (event) => {

    const btnSort = event.target.closest('.button-sort');

    if(btnSort){

        const container = btnSort.closest('.container-sort');
        const targetList = container.querySelector('.list-sort');
        const isOpen = targetList.classList.contains('active');

        closeAllSortMenu();

        if (!isOpen) {
            toggleSortMenu(btnSort);
        }


    } else {

        console.log('btn sort ELSE ');
        closeAllSortMenu();

    }

})


