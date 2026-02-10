

import { getData } from './data-service.js';
import { setupSideMenu, addWithrawMoney, openSortListModal, toggleDropdownMenu, closeModalAddEdit, closeAllDropdowns, createNewPot, sendData } from './ui-utils.js';


( async () => {

    try{

        setupSideMenu()//ajout ici 

        // const data = await getData.fetchData('../data.json');
        const data = await getData.fetchData('http://localhost:3000/pots');

        console.log(data);
        feedPotsPage(data);

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





function feedPotsPage(data){

    const fragmentPot = document.createDocumentFragment();
    const templatePot = document.querySelector('#template-pot');
    // const containerPots = document.querySelector('.container-article-pots');
    const containerMain = document.querySelector('.container-main');




    const listHTMLColorTag = document.querySelectorAll('.list-sort.color .li-sort');
    console.log('listHTMLColorTag', listHTMLColorTag);
    


    const colorTagsMap = {};


    listHTMLColorTag.forEach( (li) => {

        colorTagsMap[li.dataset.sort] = li;

    });



    console.log(colorTagsMap);
    

    // data.pots.forEach( (pot) => { // changement erreur avec jsonserver
    data.forEach( (pot, index) => {

        const clone = templatePot.content.cloneNode(true);
        const colorTheme = pot.theme;

        const matchingTag = colorTagsMap[colorTheme];

        if (matchingTag) {
            matchingTag.classList.add('used');
            const statusLabel = matchingTag.querySelector('.isUsed');
            if (statusLabel) statusLabel.textContent = 'Already Used';
        }

        // console.log('listHTMLColorTag.dataset.sort', listHTMLColorTag[index].dataset.sort);

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



const listSortColorTag = document.querySelectorAll('.list-sort.color .li-sort');


const btnChooseColorTag = document.querySelector('.modal-add .button-sort');



document.addEventListener('click', async (event) => {

    const btnToggleDropdown = event.target.closest('.button-edit');
    const btnOpenAddModal = event.target.closest('.open-add-modal');
    const btnOpenEditModal = event.target.closest('.open-edit-modal');
    const btnDeletePot = event.target.closest('.button-delete-budget');

    const btnAdd = event.target.closest('.button-add-money');
    const btnWithdraw = event.target.closest('.button-withdraw-money');


    const liColorTagModal = event.target.closest('.list-sort.color .li-sort');




    const btnListSort = event.target.closest('.button-sort');


    // const btnSubmit = event.target.closest('.modal-add .button-submit-modal');



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

        const labelCategory =  modalAdd.querySelector('.search-field label[for="potName"]');
        const inputCategory = labelCategory.querySelector('input');

        if(labelCategory){
            labelCategory.classList.add('is-disabled');
            inputCategory.style.pointerEvents = 'none';
            inputCategory.value = category;
            inputCategory.disabled = true;
        }
        
        /********* *********************** ***********/
        /********* GET COLOR TAG AND APPLY ON THEME ***********/

        
        event.target.closest('.dropdown').classList.remove('active');

        modalAdd.showModal();

    }


    



    if(btnAdd){
        addWithrawMoney(event, btnAdd, modalAddMoney);
    } 

    if(btnWithdraw){
        addWithrawMoney(event, btnWithdraw, modalWithdrawMoney);
    }


    
    if(btnDeletePot){

        console.log(btnDeletePot);

        const category = event.target.closest('.container-header-title').querySelector('.article-title').textContent;
        const categoryText = `Delete '${category}'?`;
        const contentText = 'Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever.';

        modalDelete.querySelector('.title').textContent = categoryText;
        modalDelete.querySelector('.text').textContent = contentText;

        event.target.closest('.dropdown').classList.remove('active');
        modalDelete.showModal();
        
    }




    //open the list tochoose the color tag
    if(btnListSort){

        const listColorTagModal = document.querySelector('.list-sort.color');
        // console.log('listColorTagModal', listColorTagModal);

        const isExpanded = btnListSort.classList.toggle('expanded');

        if(isExpanded){
            btnListSort.setAttribute('aria-expanded', 'true');
            listColorTagModal.classList.add('active');
        }
        else{
            btnListSort.setAttribute('aria-expanded', 'false');
            listColorTagModal.classList.remove('active');
        }

    }


    //choose the color tag for the new pot
    if(liColorTagModal){

        // console.log('listColorTagModal', liColorTagModal);
        // const liColorTag = listColorTagModal.querySelector('.li-sort');

        listSortColorTag.forEach( (li) => {
            li.classList.remove('selected');
            liColorTagModal.setAttribute('aria-selected', 'false');
        });

        liColorTagModal.classList.add('selected');
        liColorTagModal.setAttribute('aria-selected', 'true');

        btnChooseColorTag.querySelector('.color-tag').style.backgroundColor = liColorTagModal.dataset.sort;
        btnChooseColorTag.querySelector('.color-name').textContent = liColorTagModal.querySelector('.color-name').textContent;

        const container = liColorTagModal.closest('.container-sort');
        const btnSort = container.querySelector('.button-sort.color');
        const listContainer = container.querySelector('.list-sort.color');

        btnSort.setAttribute('aria-expanded', 'false');
        btnSort.classList.remove('expanded');
        listContainer.classList.remove('active');

    }



    // if(btnSubmit){

    //     event.preventDefault();
    //     event.stopPropagation();

    //     console.log('submit');

    //     /*************** DISABLED BUTTON SUBMIT OT AVOID MULTIPLE REQUEST *****************/

    //     const inputNamePot = document.querySelector('input[name="potName"]').value;
    //     const inputAmountPot = document.querySelector('input[name="maxspend"]').value;
    //     const colorTagPot = document.querySelector('.list-sort.color .selected').dataset.sort;

    //     console.log('inputNamePot ', inputNamePot);
    //     console.log('inputAmountPot ', inputAmountPot);
    //     console.log('colorTagPot ', colorTagPot);

    //     const name = inputNamePot;
    //     const target = inputAmountPot;
    //     const theme = colorTagPot;

    //     // createNewPot(inputNamePot, inputAmountPot, colorTagPot);

    //     const potData = {
    //         name: name,
    //         target: Number(target),
    //         total: 0,
    //         theme: theme
    //     };

    //     console.log('potData', potData);


    //     /************* ******************************* **************/

    //     /************* BLOQUER APPUIE SUBMIT AVEC DISABLED ET VOIR FONCTION TEMPS POUR LIMITER SUBMIT **************/
        
    //     try{

    //         const newPot = await sendData('http://localhost:3000/pots', potData);
    //         modalAdd.querySelector('form').reset();
    //         // modalAdd.close();
    //         // feedPotsPage({ pots: [newPot] });

    //     } catch(error){

    //         console.error('Error sending data :', error.message);
    //         alert(`Impossible to create new Pot : ${error.message}`);
        
    //     }
    
    // }


});




const formPot = document.querySelector('#createForm');


formPot.addEventListener('submit', async (event) => {


    event.preventDefault();
    event.stopPropagation();

    console.log('submit');

    
    /*************** CREER COLOR TAG DYNAMIQUE *****************/
    /*************** DISABLED BUTTON SUBMIT OT AVOID MULTIPLE REQUEST *****************/

    const inputNamePot = document.querySelector('input[name="potName"]').value;
    const inputAmountPot = document.querySelector('input[name="maxspend"]').value;
    const colorTagPot = document.querySelector('.list-sort.color .selected').dataset.sort;

    console.log('inputNamePot ', inputNamePot);
    console.log('inputAmountPot ', inputAmountPot);
    console.log('colorTagPot ', colorTagPot);

    const name = inputNamePot;
    const target = inputAmountPot;
    const theme = colorTagPot;

    // createNewPot(inputNamePot, inputAmountPot, colorTagPot);

    const potData = {
        name: name,
        target: Number(target),
        total: 0,
        theme: theme
    };

    console.log('potData', potData);


    /************* ****************************** **************/
    /************* BLOQUER APPUIE SUBMIT AVEC DISABLED ET VOIR FONCTION TEMPS POUR LIMITER SUBMIT **************/
    /************* ******************************* **************/

    try{

        const newPot = await sendData('http://localhost:3000/pots', potData);
        modalAdd.querySelector('#createForm').reset();
        modalAdd.close();

        console.log('newPot', newPot);
        
        feedPotsPage([newPot]);


    } catch(error){

        console.error('Error sending data :', error.message);
        alert(`Impossible to create new Pot : ${error.message}`);
    
    }
    
    
});



//close modal
closeModalAddEdit(modalAdd);


/* OPEN ADD LIST BUTTON MODAL */

// const btnSort = document.querySelectorAll('.button-sort');
// const listSort = document.querySelectorAll('.list-sort');
// openSortListModal(btnSort, listSort);




