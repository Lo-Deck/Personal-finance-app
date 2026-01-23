



/* --- HEADER MENU --- */

export function setupSideMenu() {

    console.log('setupSideMenu()');
    
    const container = document.querySelector('.container-header');
    const btn = document.querySelector('.button-extend-menu');

    if (!btn || !container) return;

    btn.addEventListener('click', () => {
        const isReduced = container.classList.toggle('reduce');
        container.classList.toggle('large', !isReduced);
    });

    // if(isBtnMenuClicked){
    //     container.classList.add('reduce');
    //     container.classList.remove('large');
    // } else {
    //     container.classList.remove('reduce');
    //     container.classList.add('large');
    // }
 
}






/**
 * Manages the display and configuration of the add/withdraw money modals.
 * This function is triggered when clicking the action buttons of a savings "Pot".
 * @param {Event} event - The click event object (used to stop propagation).
 * @param {HTMLElement} btn - The specific button that triggered the action.
 * @param {HTMLDialogElement} modal - The <dialog> element to configure and display.
 */

export function addWithrawMoney(event, btn, modal){

    event.stopPropagation();
    const category = btn.closest('.container-article').querySelector('.container-header-title .article-title').textContent;

    if(btn.classList.contains('button-add-money')){
        // console.log(btn.classList);
        modal.querySelector('.title').textContent = `Add from '${category}'`;
    } else {
        // console.log(btn.classList);
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

            // for(let i = 0; i < button.length; i++){
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
 * @param {HTMLElement} button  - The menu to display.
 */

export function setupDropdownMenu() {

    document.addEventListener('click', (event) => {

        const dropDownMenu = document.querySelectorAll('.dropdown');  
        const btn = event.target.closest('.button-edit');

        if(btn){
            
            event.stopPropagation();
            const currentDropdown = btn.parentElement.querySelector('.dropdown');

            for(let i = 0; i < dropDownMenu.length; i++){
                dropDownMenu[i] === currentDropdown ? currentDropdown.classList.toggle('active') : dropDownMenu[i].classList.remove('active');
            }

        }

    })

    window.addEventListener('click', () => {
        document.querySelectorAll('.dropdown.active').forEach(menu => {
            menu.classList.remove('active');
        });
    });

}


