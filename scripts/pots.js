

import { getData } from './data-service.js';
import { setupSideMenu, addWithrawMoney, openSortListModal, toggleDropdownMenu, closeModalAddEdit, closeAllDropdowns } from './ui-utils.js';


( async () => {

    try{

        setupSideMenu()//ajout ici 

        const data = await getData.fetchData('../data.json');
        console.log(data);
        feedPotsPage(data);

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





function feedPotsPage(data){

    const fragmentPot = document.createDocumentFragment();
    const templatePot = document.querySelector('#template-pot');
    // const containerPots = document.querySelector('.container-article-pots');
    const containerMain = document.querySelector('.container-main');

    data.pots.forEach( (pot) => {

        const clone = templatePot.content.cloneNode(true);
        const colorTheme = pot.theme;

        //header
        const header = clone.querySelector('.container-title');
        header.querySelector('.color-tag').style.backgroundColor = colorTheme;
        header.querySelector('.article-title').textContent = pot.name;

        //body
        const body = clone.querySelector('.amount-saved');
        body.querySelector('.saved').textContent = `$${pot.total}`;

        //graph
        const percent = Math.min(((pot.total / pot.target) * 100).toFixed(2), 100);
        clone.querySelector('.line-graph').style.backgroundColor = colorTheme;
        clone.querySelector('.line-graph').style.width = `${percent}%`;

        //target
        body.querySelector('.percent').textContent = `${percent}%`;
        body.querySelector('.amount').textContent = `$${pot.target}`;

        fragmentPot.appendChild(clone);

    });

    // containerPots.appendChild(fragmentPot);
    containerMain.appendChild(fragmentPot);

}





/*** LISTENER ***/


const modalAdd = document.querySelector('.modal-add');
const modalDelete = document.querySelector('.modal-delete');


const modalAddMoney = document.querySelector('.modal-add-money');
const modalWithdrawMoney = document.querySelector('.modal-withdraw-money');


document.addEventListener('click', (event) => {

    const btnToggleDropdown = event.target.closest('.button-edit');
    const btnOpenAddModal = event.target.closest('.open-add-modal');
    const btnOpenEditModal = event.target.closest('.open-edit-modal');
    const btnDeleteBudget = event.target.closest('.button-delete-budget');


    if(btnToggleDropdown){
        event.stopPropagation();
        toggleDropdownMenu(btnToggleDropdown)
    } else {
        closeAllDropdowns();
    }

    if (btnOpenAddModal) {
        const title = 'Add New Pot';
        const descriptionText = 'Create a pot to set savings targets. These can help keep you on track as you save for special purchases.';
        const buttonText = 'Add Pot';
        modalAdd.querySelector('.title').textContent = title;
        modalAdd.querySelector('.text:nth-of-type(1)').textContent = descriptionText;
        modalAdd.querySelector('.button-submit-modal').textContent = buttonText;
        modalAdd.showModal();
    }


    if(btnOpenEditModal){
        const title = 'Edit Pot';
        const descriptionText = 'If your saving targets change, feel free to update your pots.';
        const buttonText = 'Save Changes';
        modalAdd.querySelector('.title').textContent = title;
        modalAdd.querySelector('.text:nth-of-type(1)').textContent = descriptionText;
        modalAdd.querySelector('.button-submit-modal').textContent = buttonText;

        //specification button edit

        const category = event.target.closest('.container-header-title').querySelector('.article-title').textContent;
        const btnCategoryList = modalAdd.querySelector('.search-field .container-sort:nth-of-type(1) .button');
        btnCategoryList.querySelector('span').textContent = category;
        btnCategoryList.disabled = true;
        btnCategoryList.style.opacity = '0.5';
        btnCategoryList.style.pointerEvents = 'none';
        btnCategoryList.style.cursor = 'not-allowed';
        event.target.closest('.dropdown').classList.remove('active');
        modalAdd.showModal();
    }

    const btnAdd = event.target.closest('.button-add-money');
    const btnWithdraw = event.target.closest('.button-withdraw-money');

    if(btnAdd){
        addWithrawMoney(event, btnAdd, modalAddMoney);
    } 

    if(btnWithdraw){
        addWithrawMoney(event, btnWithdraw, modalWithdrawMoney);
    }



    if(btnDeleteBudget){

        console.log(btnDeleteBudget);

        const category = event.target.closest('.container-header-title').querySelector('.article-title').textContent;
        const categoryText = `Delete '${category}'?`;
        const contentText = 'Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever.';

        modalDelete.querySelector('.title').textContent = categoryText;
        modalDelete.querySelector('.text').textContent = contentText;

        event.target.closest('.dropdown').classList.remove('active');
        modalDelete.showModal();
        
    }



});


//close modal
closeModalAddEdit(modalAdd);


/* OPEN ADD LIST BUTTON MODAL */

const btnSort = document.querySelectorAll('.button-sort');
const listSort = document.querySelectorAll('.list-sort');
openSortListModal(btnSort, listSort);




