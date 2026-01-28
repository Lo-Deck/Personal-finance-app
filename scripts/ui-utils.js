



/**
 * Open close side menu.
 */

export function setupSideMenu() {

    // console.log('setupSideMenu()');
    
    const container = document.querySelector('.container-header');
    const btn = document.querySelector('.button-extend-menu');

    if (!btn || !container) return;

    btn.addEventListener('click', () => {
        const isReduced = container.classList.toggle('reduce'); /* VERIFIER FONCTIONNEMENT */
        container.classList.toggle('large', !isReduced);
    });

}






/**
 * Manages the display and configuration of the add/withdraw money modals.
 * This function is triggered when clicking the action buttons of a savings "Pot".
 * @param {Event} event - The click event object (used to stop propagation).
 * @param {HTMLElement} btn - The specific button that triggered the action.
 * @param {HTMLDialogElement} modal - The <dialog> element to configure and display.
 */

export function addWithrawMoney(event, btn, modal){

    const category = btn.closest('.container-article').querySelector('.container-header-title .article-title').textContent;

    if(btn.classList.contains('button-add-money')){
        modal.querySelector('.title').textContent = `Add from '${category}'`;
    } else {
        modal.querySelector('.title').textContent = `Withdraw from '${category}'`;
    }

    const extractModal = btn.closest('.container-article').querySelector('.extract-modal');
    const clone = extractModal.cloneNode(true);
    modal.querySelector('.import-modal').textContent = '';
    modal.querySelector('.import-modal').appendChild(clone);

    modal.showModal();

}





/**
 * Manages toggle switches for sort lists (modal/menus).
 * Only one list can be active at a time.
 * @param {NodeList} buttons - The name/theme where choose from.
 * @param {NodeList} lists - The list of category/name to choose.
 */


export function openSortListModal(buttons, lists){

    buttons.forEach( ( btn, index ) => {

        btn.addEventListener('click', () => {

            lists.forEach( (list, i) => {

                if(i === index){
                    list.classList.toggle('active');
                } else {
                    list.classList.remove('active');
                }

            })

        });

    });

}





/**
 * Manages toggle switches for dropdown menu (3 dots).
 * Only one menu can be active at a time.
 * @param {HTMLElement} btn  - The menu to display.
 */

export function toggleDropdownMenu(btn) {

    const dropDownMenu = document.querySelectorAll('.dropdown');  
    const currentDropdown = btn.parentElement.querySelector('.dropdown');

    for(let i = 0; i < dropDownMenu.length; i++){
        dropDownMenu[i] === currentDropdown ? currentDropdown.classList.toggle('active') : dropDownMenu[i].classList.remove('active');
    }

}


/**
 * Close all Dropdown menu when clicked on window.
 */

export function closeAllDropdowns() {
    document.querySelectorAll('.dropdown.active').forEach(menu => {
        menu.classList.remove('active');
    });
}






/**
 * function to open modal box.
 * modal to add or edit pots/budgets.
 * @param {string} title - The title text to display in the modal.
 * @param {string} text - The description or body text for the modal.
 * @param {string} button - The text for the submit button.
 */



/**
 * Function to close modal box, reset all the list and style.
 * Close all list open.
 */

export function closeModalAddEdit(modal){
   
    // const modalAdd = document.querySelector('.modal-add');
    const btnCloseModal = document.querySelector('.close-modal');

    btnCloseModal.addEventListener('click', () => {

        const btnCategoryList = modal.querySelector('.search-field .container-sort:nth-of-type(1) .button');

        btnCategoryList.disabled = false;
        btnCategoryList.style.opacity = '1';
        btnCategoryList.style.pointerEvents = 'auto';
        btnCategoryList.style.cursor = 'pointer';

        modal.querySelectorAll('.list-sort').forEach( (item) => {
            item.classList.remove('active');
        });

    });

}


































/**
 * Function to toggle list sort/category by,
 * in the search tag
 * @param {HTMLElement} btn - The button to push to open the list sort by.
 */

export function toggleSortMenu(btn){

    const container = btn.closest('.container-sort');    
    const listSort = container.querySelector('.list-sort');
    const caret = btn.querySelector('.caret');
    const isActive = listSort.classList.toggle('active');
    caret.style.transform = isActive ? "rotate(180deg)" : "rotate(0deg)";
    btn.setAttribute('aria-expanded', isActive);        

}


/**
 * Function to close list sort/category by,
 * in the search tag
 */

export function closeAllSortMenu(){

    document.querySelectorAll('.search-field .list-sort.active').forEach( menu => {

        menu.classList.remove('active');
        const btn = menu.closest('.container-sort').querySelector('.button-sort');
        const caret = btn.querySelector('.caret');
        caret.style.transform = "rotate(0deg)";
        btn.setAttribute('aria-expanded', 'false');        

    });


}



















/*******  NOUBLIE PAS LES ARIA LABEL POUR LE CHANGEMENT DE CATEGORIE SORT CATEGORY LIST******** */

//ARIA LABEL

// li.setAttribute('aria-selected', 'true');  A METTRE ARIA LABEL LIST-SORT LI  

// const prefix = btn.dataset.prefix;
// btn.setAttribute('aria-label', `${prefix} ${li.textContent}`);

// ARIA_SELECTED SUR LI A FAIRE ET ARIA-LABEL SUR BUTTON A MODIFIER AVEC SELECTION LI

// *************** ET BUG CATEGORY NE SAFFICHE PAS **************




export function billSortBy(data, liSortBy){

    console.log('btnSortBy', liSortBy);
    const dataSort = liSortBy.dataset.sort;
    console.log('data-sort: ', dataSort);

    const btnMenuSortText = document.querySelector('.button-sort .text'); 

    btnMenuSortText.textContent = dataSort;

    document.querySelectorAll('.list-sort.sort .li-sort').forEach( (li) => {
        // li.classList.contains('selected') ? li.classList.remove('selected') : li.classList.add('selected');
        li.classList.remove('selected');
    });

    liSortBy.classList.add('selected');

    

    // const sortBill = Array.from(
    //     recurringTransactions.reduce( (map, obj) => {
    //         map.set(obj.name, obj)
    //         return map;
    //     }, new Map()).values()
    // );

    let recurringTransactions = data.transactions.filter(transaction => transaction.recurring);
    console.log('recurringTransactions', recurringTransactions);

    const sortBillMap = new Map();    
    
    recurringTransactions.forEach( (transaction) => {
        sortBillMap.set(transaction.name, transaction);
    });

    const sortBill = Array.from(sortBillMap.values());    
    console.log('sortBill before map: ', sortBill);
    
    sortBill.sort( (a, b) => {

        let valueA = new Date(a.date).getDate();
        let valueB = new Date(b.date).getDate();

        switch(dataSort){
            case 'Latest': return valueA - valueB;
            case 'Oldest': return valueB - valueA;
            case 'A to Z': return a.name.localeCompare(b.name);
            case 'Z to A': return b.name.localeCompare(a.name);
            case 'Highest': return Math.abs(b.amount) - Math.abs(a.amount);
            case 'Lowest': return Math.abs(a.amount) - Math.abs(b.amount);
            default: return 0;
        }

    });


    console.log('sortBill', sortBill);

    const currentDate = new Date('2024-08-19T00:00:00');
    const today = currentDate.getDate();

    const referenceDate = new Date(currentDate);
    const dayPlusFive = new Date(referenceDate);

    dayPlusFive.setDate(referenceDate.getDate() + 5);
    const daydueSoon = dayPlusFive.getDate();


    const fragmentBill = document.createDocumentFragment();
    const templateBill = document.querySelector('#template-transaction');
    // const containerTransactions = document.querySelector('.container-transactions');
    const containerTransactions = document.querySelector('.append-transactions');


    containerTransactions.textContent = '';

    sortBill.forEach( (transaction) => {

        const clone = templateBill.content.cloneNode(true);

        if(transaction.avatar && transaction.avatar.startsWith('../')){
            clone.querySelector('.avatar').src = transaction.avatar;            
        }

        clone.querySelector('.cell-name .text').textContent = transaction.name; 
        clone.querySelector('.cell-amount .text').textContent = `$${Math.abs(transaction.amount).toFixed(2)}`;            

        let billDate = new Date(transaction.date).getDate();
        // console.log('billDate', billDate);

        const suffixes = [ 'st', 'nd', 'rd' ];
        const suffix = suffixes[billDate] || 'th';
        const textDate = `Monthly-${billDate}${suffix}`;

        clone.querySelector('.cell-date time').textContent = textDate;        

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

    });

    containerTransactions.appendChild(fragmentBill);


}

