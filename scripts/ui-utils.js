

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

export function addWithrawMoney(data, btn, modal){

    // const category = btn.closest('.container-article').querySelector('.container-header-title .article-title').textContent;

    const { name } = data;

    const category = name;
    console.log('category', category);


    if(btn.classList.contains('button-add-money')){
        modal.querySelector('.title').textContent = `Add from '${category}'`;
        modal.querySelector('label .text').textContent = 'Amount to Add';
        modal.querySelector('.button-submit-modal').textContent = 'Confirm Addition';
        modal.dataset.operator = 'plus';
    } else {
        modal.querySelector('.title').textContent = `Withdraw from '${category}'`;
        modal.querySelector('label .text').textContent = 'Amount to Withdraw';
        modal.querySelector('.button-submit-modal').textContent = 'Confirm Withdrawal';
        modal.dataset.operator = 'minus';
    }

    const extractModal = btn.closest('.container-article').querySelector('.extract-modal');
    const clone = extractModal.cloneNode(true);
    modal.querySelector('.import-modal').textContent = '';
    modal.querySelector('.import-modal').appendChild(clone);

    // modal.dataset.id = id;

    modal.showModal();

}





/**
 * Manages toggle switches for sort lists (modal/menus).
 * Only one list can be active at a time.
 * @param {NodeList} buttons - The name/theme where choose from.
 * @param {NodeList} lists - The list of category/name to choose.
 */

// export function openSortListModal(buttons, lists){

//     buttons.forEach( ( btn, index ) => {

//         btn.addEventListener('click', () => {

//             lists.forEach( (list, i) => {

//                 if(i === index){
//                     list.classList.toggle('active');
//                 } else {
//                     list.classList.remove('active');
//                 }

//             })

//         });

//     });

// }


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
 * Function to close modal box, reset all the list and style.
 * Close all list open.
 */

export function closeModalAddEdit(btn, event){
   
    // const btnCloseModal = document.querySelector('.close-modal');

    // btnCloseModal.addEventListener('click', () => {

    //     const btnCategoryList = modal.querySelector('.search-field .container-sort:nth-of-type(1) .button');

    //     btnCategoryList.disabled = false;
    //     btnCategoryList.style.opacity = '1';
    //     btnCategoryList.style.pointerEvents = 'auto';
    //     btnCategoryList.style.cursor = 'pointer';

    //     modal.querySelectorAll('.list-sort').forEach( (item) => {
    //         item.classList.remove('active');
    //     });

    // });


    if(btn){

        const container = event.target.closest('.modal');
        const btnSort = container.querySelectorAll('.container-sort .button-sort');

        // console.log('budget close modal');
        
        btnSort.forEach( (btn) => {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
            btn.style.cursor = 'pointer';
            btn.classList.remove('expanded');
            btn.setAttribute('aria-expanded', 'false');
        });

        const listSort = container.querySelectorAll('.container-sort .list-sort');
        listSort.forEach( (list) => {
            list.classList.remove('active');
        });

        document.querySelector('#createForm').reset();

    }

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



/**
 * Function to sort the recurring bill,
 * @param {Array<object>} recurringBill - The data bill recurring.
 * @param {HTMLLIElement} liSortBy - get the dataset to sort by .
 */

export function billSortBy(recurringBill, liSortBy){

    //set text btn sort by
    const dataSort = liSortBy.dataset.sort;
    const btnMenuSortText = document.querySelector('.button-sort .text'); 
    btnMenuSortText.textContent = dataSort;


    document.querySelectorAll('.list-sort.sort .li-sort').forEach( (li) => {
        li.classList.remove('selected');
        li.setAttribute('aria-selected', 'false');
    });

    liSortBy.classList.add('selected');
    liSortBy.setAttribute('aria-selected', 'true');

    document.querySelector('.button-sort').setAttribute('aria-label', `Sort by ${dataSort}`);


    const searchByName = document.querySelector('input').value;

    const recurringBillSort = [...recurringBill].filter( (bill) => {

        const name = bill.name.toLowerCase();        

        if( name.startsWith(searchByName) ){
            return bill;
        }

    }).sort( (a, b) => {

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


    const currentDate = new Date('2024-08-19T00:00:00');
    const today = currentDate.getDate();
    const referenceDate = new Date(currentDate);
    const dayPlusFive = new Date(referenceDate);
    dayPlusFive.setDate(referenceDate.getDate() + 5);
    const daydueSoon = dayPlusFive.getDate();


    const fragmentBill = document.createDocumentFragment();
    const templateBill = document.querySelector('#template-transaction');
    const containerTransactions = document.querySelector('.append-transactions');

    containerTransactions.textContent = '';


    recurringBillSort.forEach( (transaction) => {

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

    });


    containerTransactions.appendChild(fragmentBill);

    return recurringBillSort;

}



/**
 * Function to sort / category the transaction,
 * @param {Array<object>} transactions - The data bill transaction.
 * @param {HTMLLIElement} liSortBy - get the dataset to sort by .
 * @param {HTMLLIElement} liCategoryBy - get the dataset category .
 */

export function transactionSliceBy(transactions, liSortBy, liCategoryBy){

    let dataSort;

    if(liSortBy){

        dataSort = liSortBy.dataset.sort;

        document.querySelectorAll('.list-sort.sort .li-sort').forEach( (li) => {
            li.classList.remove('selected');
            li.setAttribute('aria-selected', 'false');
        });

        liSortBy.classList.add('selected');
        liSortBy.setAttribute('aria-selected', 'true');

        document.querySelector('.button-sort.sort').setAttribute('aria-label', `Sort by ${dataSort}`);        
    } 

    else {
        dataSort = document.querySelector('.list-sort.sort .li-sort.selected').dataset.sort;
    }


    const btnMenuSortText = document.querySelector('.button-sort.sort .text'); 
    btnMenuSortText.textContent = dataSort;


    let dataCategory;

    if(liCategoryBy){

        dataCategory = liCategoryBy.dataset.category;

        document.querySelectorAll('.list-sort.category .li-sort').forEach( (li) => {
            li.classList.remove('selected');
            li.setAttribute('aria-selected', 'false');
        });

        liCategoryBy.classList.add('selected');
        liCategoryBy.setAttribute('aria-selected', 'true');

        document.querySelector('.button-sort.category').setAttribute('aria-label', `Category ${dataCategory}`);

    }
    else {
        dataCategory = document.querySelector('.list-sort.category .li-sort.selected').dataset.category;
    }

    const btnMenuCategoryText = document.querySelector('.button-sort.category .text'); 
    btnMenuCategoryText.textContent = dataCategory;

    const searchByName = document.querySelector('input').value;

    const transactionFilter = [...transactions].filter( (transaction) => {

        const name = transaction.name.toLowerCase();

        if( name.startsWith(searchByName) ){
            return transaction;
        }

    }).filter(t => dataCategory === 'All transactions' || t.category.toLowerCase() === dataCategory.toLowerCase())
    .sort( (a, b) => {

        let valueA = new Date(a.date);
        let valueB = new Date(b.date);

        switch(dataSort){
            case 'Latest': return valueB - valueA;
            case 'Oldest': return valueA - valueB;
            case 'A to Z': return a.name.localeCompare(b.name);
            case 'Z to A': return b.name.localeCompare(a.name);
            case 'Highest': return Math.abs(b.amount) - Math.abs(a.amount);
            case 'Lowest': return Math.abs(a.amount) - Math.abs(b.amount);
            default: return valueB - valueA;
        }

    });


    const fragmentTransaction = document.createDocumentFragment();
    const templateTransaction = document.querySelector('#template-transaction');
    const containerTemplateTransactions = document.querySelector('.container-template-transactions');

    containerTemplateTransactions.textContent = '';


    transactionFilter.slice(0, 10).forEach( (transaction) => {

        const clone = templateTransaction.content.cloneNode(true);

        if(transaction.avatar && transaction.avatar.startsWith('../')){
            clone.querySelector('.avatar').src = transaction.avatar;            
        }

        clone.querySelector('.cell-name .text').textContent = transaction.name;
        clone.querySelector('.cell-amount .text').textContent = `$${Math.abs(transaction.amount).toFixed(2)}`;

        clone.querySelector('.cell-category .text').textContent = transaction.category;

        const transactionDate = new Date(transaction.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        clone.querySelector('.cell-date time').textContent = transactionDate;        

        fragmentTransaction.appendChild(clone);

    });

    containerTemplateTransactions.appendChild(fragmentTransaction);
    return transactionFilter;

}



/**
 * Function to choose the page,
 * @param {HTMLDivElement} container - where to set the navigation for multiple pages.
 * @param {Array} dataLength - to have the number of pages to set.
 */

export function createNavBar(container, dataLength){

    //create nav
    var nav = document.createElement('nav');
    nav.classList.add('pages');
    nav.setAttribute('aria-label', 'pagination');

    //create ul
    const ul = document.createElement('ul');
    nav.appendChild(ul);
    ul.classList.add('list', 'list-pages', 'public-sans-regular');

    //create li previous
    const liPrevious = document.createElement('li');
    liPrevious.classList.add('li-page', 'previous', 'disabled');
    liPrevious.dataset.page = 'previous';
    liPrevious.innerHTML = `<button type="button" class="button previous" aria-label="page previous" disabled="true"><svg fill="none" height="11" viewBox="0 0 6 11" width="6" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                                                                                    <path d="m5.14656 10.8535-5.000005-4.99997c-.046488-.04643-.0833676-.10158-.1085298-.16228-.0251623-.06069-.03811269-.12576-.0381127-.19147 0-.0657.0129504-.13077.0381126-.19147.0251623-.06069.0620419-.11584.1085299-.16228l4.999995-4.999997c.06993-.0700052.15906-.117689.2561-.13701419.09704-.01932521.19764-.0094229.28905.02845329.09141.0378763.16953.1020229.22447.1843199.05493.082297.08421.179044.08414.277991v10.000017c.00007.0989-.02921.1957-.08414.278-.05494.0823-.13306.1464-.22447.1843s-.19201.0478-.28905.0284c-.09704-.0193-.18617-.067-.25609-.137z"/>
                                                                                                                </svg><span>Prev</span></button>`;
    ul.appendChild(liPrevious);

    for(let i = 0; i < Math.ceil(dataLength / 10); i++){ //NUMBER OF BUTTON = PAGES
        const li = document.createElement('li');
        i === 0 ? li.classList.add('li-page', 'active') : li.classList.add('li-page');
        li.dataset.page = `${i+1}`;
        li.innerHTML = `<button type="button" class="button button-page" aria-label="Page ${i+1}">${i+1}</button>`;// VOIR POUR CHANGER INNERHTML
        ul.appendChild(li);
    }

    //create li next
    const liNext = document.createElement('li');
    liNext.classList.add('li-page', 'next');
    liNext.dataset.page = 'next';
    liNext.innerHTML = `<button type="button" class="button next" aria-label="page next"><span>Next</span><svg fill="none" height="11" viewBox="0 0 6 11" width="6" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                                                                        <path d="m.853506.146465 5.000004 5.000005c.04648.04643.08336.10158.10853.16228.02516.06069.03811.12576.03811.19147 0 .0657-.01295.13077-.03811.19147-.02517.06069-.06205.11584-.10853.16228l-5.000004 5.00003c-.069927.07-.159054.1177-.256097.137-.097042.0193-.197637.0094-.289048-.0285-.091412-.0378-.16953-.102-.2244652-.1843-.0549354-.0823-.08421767-.179-.08413981-.278l-.00000043-9.999984c-.00007788-.098949.02920444-.195695.08413984-.277992.0549356-.082297.1330536-.1464431.2244646-.1843193.091412-.03787611.192007-.04777907.289049-.02845381.097042.01932521.186169.06700801.256097.13701411z"/>
                                                                                                </svg></button>`;
    ul.appendChild(liNext);

    container.appendChild(nav);

}



/**
 * Function to choose the page,
 * @param {HTMLLIElement} li - the data attribute to set the new page.
 * @param {Array<Object>} data - the data to work on .
 */

export function choosePageNavbar(li, data){

    const currentPage = document.querySelector('.list-pages .active').getAttribute('data-page');
    const dataPage = li.getAttribute('data-page') ?? "1";

    let numberPage;

    if(dataPage !== null){
        if( isNaN(Number(dataPage)) ){
            numberPage = dataPage === 'next' ? Number(currentPage) + 1 : Number(currentPage) - 1;
        } else {
            numberPage = Number(dataPage); 
        }
    }

    const liPages = document.querySelectorAll('.li-page');
    const lastPage = liPages.length-2;

    liPages[currentPage].classList.remove('active');
    liPages[numberPage].classList.add('active');


    if( numberPage !== 1 || numberPage !== lastPage ){
        liPages[0].classList.remove('disabled');
        liPages[0].querySelector('.button').disabled = false;
        liPages[liPages.length-1].classList.remove('disabled');
        liPages[liPages.length-1].querySelector('.button').disabled = false;
    }

    if(numberPage === 1){
        liPages[0].classList.add('disabled');
        liPages[0].querySelector('.button').disabled = true;
    }

    if(numberPage === lastPage){
        liPages[liPages.length-1].classList.add('disabled');
        liPages[liPages.length-1].querySelector('.button').disabled = true;
    }


    if( numberPage ){

        const fragmentTransaction = document.createDocumentFragment();
        const templateTransaction = document.querySelector('#template-transaction');
        const containerTemplateTransactions = document.querySelector('.container-template-transactions');
        containerTemplateTransactions.textContent = '';

        data.slice( (numberPage-1) * 10 , (numberPage) * 10 ).forEach( (data) => {

            const clone = templateTransaction.content.cloneNode(true);
            if(data.avatar && data.avatar.startsWith('../')){
                clone.querySelector('.avatar').src = data.avatar;            
            }
            clone.querySelector('.cell-name .text').textContent = data.name; 
            clone.querySelector('.cell-amount .text').textContent = `$${Math.abs(data.amount).toFixed(2)}`;

            clone.querySelector('.cell-category .text').textContent = data.category;

            const transactionDate = new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            clone.querySelector('.cell-date time').textContent = transactionDate;        
            fragmentTransaction.appendChild(clone);

        });

        containerTemplateTransactions.appendChild(fragmentTransaction);

    }

}



/**
 * create a list with the category in the data.json,
 * @param {Array<Object>} data - the data to work on .
 * @param {boolean} listForModal - list for modal or not.
 */

export function createListHTMLCategory(data, listForModal){

    const categoryHTMLList = document.querySelector('.list-sort.category');
    const categoryMapList = new Map();

    data.forEach( (transaction) => {
        categoryMapList.set(transaction.category, transaction.category);
    });

    const categoryList = Array.from(categoryMapList.values());
    console.log('categoryList', categoryList);

    categoryList.forEach( (transaction) => {

        const li = document.createElement('li');
        li.classList.add('li-sort');
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', 'false');
        li.setAttribute('data-category', `${transaction}`);
        // li.textContent = `${transaction}`;

        if(listForModal){

            const spanTextContent = document.createElement('span');
            spanTextContent.classList.add('category-name');
            spanTextContent.textContent = `${transaction}`;
            li.appendChild(spanTextContent);

            const spanIsUsed = document.createElement('span');
            spanIsUsed.classList.add('isUsed');
            spanIsUsed.textContent = 'Already Used';
            li.appendChild(spanIsUsed);

        }
        else{

            li.textContent = `${transaction}`;

        }

        categoryHTMLList.appendChild(li);

    });


}



/**
 * Updates the UI when a category or color is selected.
 * @param {HTMLLIElement} li - The list item element clicked by the user.
 */

export function chooseLiColorCategory(li){

    const container = li.closest('.container-sort');
    const btnSort = container.querySelector('.button-sort');
    const listContainer = container.querySelector('.list-sort');
    const liSort = listContainer.querySelectorAll('.li-sort');

    liSort.forEach( (li) => {
        li.classList.remove('selected');
        li.setAttribute('aria-selected', 'false');
    });

    li.classList.add('selected');
    li.setAttribute('aria-selected', 'true');

/* <button type="button" class="button button-sort category" aria-label="choose category" aria-haspopup="listbox" aria-expanded="false" aria-controls="category-list"><span class="category-name public-sans-regular text-preset-4">Entertainement</span><img src="../assets/images/icon-caret-down.svg" alt="" class="caret"></button>
<button type="button" class="button button-sort color" aria-label="choose color-tag" aria-haspopup="listbox" aria-expanded="false" aria-controls="sort-list"><span class="color-tag"></span><span class="color-name public-sans-regular text-preset-4">Green</span><img src="../assets/images/icon-caret-down.svg" alt="" class="caret"></button> */

    if(btnSort.classList.contains('category')){
        btnSort.querySelector('.category-name').textContent = li.querySelector('.category-name').textContent;        
    }
    else{
        btnSort.querySelector('.color-tag').style.backgroundColor = li.dataset.sort;
        btnSort.querySelector('.color-name').textContent = li.querySelector('.color-name').textContent;        
    }


    btnSort.setAttribute('aria-expanded', 'false');
    btnSort.classList.remove('expanded');

    listContainer.classList.remove('active');


}





export function createSVGChart(data, budgetAmountbyCategory){


    function createCircle(r, colorStroke, dashArray, dashOffset){
        const circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        circle.setAttribute('cx', '50');
        circle.setAttribute('cy', '50');
        circle.setAttribute('r', r);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', colorStroke);
        circle.setAttribute('stroke-width', r === 40 ? '16' : '8');
        circle.setAttribute('stroke-dasharray', dashArray);
        circle.setAttribute('stroke-dashoffset', dashOffset);
        return circle;
    }


    const chart = document.querySelector('.chart');
    chart.textContent = '';

    const maxBudget = data.reduce( (acc, budget) => {
        return acc + budget.maximum;
    }, 0)

    //circonference of the circle color 40 et opacity 35
    const circonference40 = Math.ceil(2 * Math.PI * 40);
    const circonference35 = Math.ceil(2 * Math.PI * 35);

    // offset used to when start the next ring
    let dashOffset40 = 0;
    let dashOffset35 = 0;

    const chartHover = document.querySelector('.chart-hover');
    const chartHoverIcon = chartHover.querySelector('.chart-icon');
    const chartHoverCategory = chartHover.querySelector('.category');
    const chartHoverCategoryAmount = chartHover.querySelector('.category-amount');
    const chartHoverCategoryTotal = chartHover.querySelector('.category-total-amount');

    data.forEach( (budget) => {

        const g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        g.classList.add('segment');

        //create className with category
        g.classList.add(`${(budget.category).replace(' ', '-').toLowerCase()}`);
        const percentBudget = budget.maximum / maxBudget * 100;

        //length of the color ring and opacity
        const strokeDasharray40 = ((percentBudget / 100) * circonference40).toFixed(2);
        const strokeDasharray35 = ((percentBudget / 100) * circonference35).toFixed(2);

        //length of the ring and the transparent ring transform into text
        const strokeDasharray40Text = `${strokeDasharray40} ${(circonference40 - strokeDasharray40).toFixed(2)}`;
        const strokeDasharray35Text = `${strokeDasharray35} ${(circonference35 - strokeDasharray35).toFixed(2)}`;

        //offset used in the function
        const dashOffset40Text = `-${dashOffset40.toFixed(2)}`;
        const dashOffset35Text = `-${dashOffset35.toFixed(2)}`;

        //creating circle
        g.appendChild(createCircle(40, budget.theme, strokeDasharray40Text, dashOffset40Text));
        g.appendChild(createCircle(35, "rgba(255, 255, 255, 0.3)", strokeDasharray35Text, dashOffset35Text));
        chart.insertAdjacentElement('beforeend', g);        

        //calculation for the next offset where to start the next ring
        dashOffset40 += Number(strokeDasharray40);
        dashOffset35 += Number(strokeDasharray35);

        //hover svg chart
        g.addEventListener('mouseenter', () => {
            chartHover.style.opacity = 1;
            chartHover.style.visibility = 'visible';
            chartHoverIcon.style.backgroundColor = budget.theme
            chartHoverCategory.textContent = budget.category;
            chartHoverCategoryAmount.textContent = `Budget Spent: $${budgetAmountbyCategory.get(budget.category)}`;
            chartHoverCategoryTotal.textContent = `Budget Maximum: $${budget.maximum}`;

        });

        g.addEventListener('mousemove', (event) => {
            const rect = g.getBoundingClientRect();
            const mouseXRelative = event.clientX - rect.left;
            const mouseYRelative = event.clientY - rect.top;
            chartHover.style.transform = `translate3d(${mouseXRelative + 25}px, ${mouseYRelative + 25}px, 0)`;//VOIR POUR UTILISER TRANSLATE AU LIEU DE TRANSLATE3D
        });

        g.addEventListener('mouseleave', () => {
            chartHover.style.opacity = 0;
            chartHover.style.visibility = 'hidden';
        });

    });






}
