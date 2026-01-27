



/**
 * Open close side menu.
 */

export function setupSideMenu() {

    console.log('setupSideMenu()');
    
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
 * Function to toggle list sort by.
 * in the <search> tag
 * @param {HTMLElement} btn - The button to push to open the list sort by.
 */






/*******  NOUBLIE PAS LES ARIA LABEL POUR LE CHANGEMENT DE CATEGORIE SORT CATEGORY LIST******** */

//ARIA LABEL

// li.setAttribute('aria-selected', 'true');  A METTRE ARIA LABEL LIST-SORT LI  

// const prefix = btn.dataset.prefix;
// btn.setAttribute('aria-label', `${prefix} ${li.textContent}`);

// ARIA_SELECTED SUR LI A FAIRE ET ARIA-LABEL SUR BUTTON A MODIFIER AVEC SELECTION LI

// *************** ET BUG CATEGORY NE SAFFICHE PAS **************


export function toggleSortMenu(btn){

    const container = btn.closest('.container-sort');    
    const listSort = container.querySelector('.list-sort');
    const caret = btn.querySelector('.caret');
    const isActive = listSort.classList.toggle('active');
    caret.style.transform = isActive ? "rotate(180deg)" : "rotate(0deg)";
    btn.setAttribute('aria-expanded', isActive);        

}



export function closeAllSortMenu(){

    document.querySelectorAll('.search-field .list-sort.active').forEach( menu => {

        menu.classList.remove('active');
        const btn = menu.closest('.container-sort').querySelector('.button-sort');
        const caret = btn.querySelector('.caret');
        caret.style.transform = "rotate(0deg)";
        btn.setAttribute('aria-expanded', 'false');        

    });


}
