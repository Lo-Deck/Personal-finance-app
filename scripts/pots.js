

import { getData, sendData } from './data-service.js';
import { setupSideMenu, addWithrawMoney, toggleDropdownMenu, closeAllDropdowns, closeModalAddEdit, chooseLiColorCategory, validateInput } from './ui-utils.js';


const colorTagsMap = {};//keep track of the color
const referencePotId = new WeakMap();
const listHTMLColorTag = document.querySelectorAll('.list-sort.color .li-sort');


( async () => {

    try{

        setupSideMenu()

        const data = await getData.fetchData('http://localhost:3000/pots');

        listHTMLColorTag.forEach( (li) => {
            colorTagsMap[li.dataset.sort] = li;
        });

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



function createArticle(data){

    const fragmentPot = document.createDocumentFragment();
    const templatePot = document.querySelector('#template-pot');

    data.forEach( (pot) => {

        const clone = templatePot.content.cloneNode(true);
        const colorTheme = pot.theme;

        const matchingTag = colorTagsMap[colorTheme];

        if (matchingTag) {
            matchingTag.classList.add('used');
            const statusLabel = matchingTag.querySelector('.isUsed');
            if (statusLabel) statusLabel.textContent = 'Already Used';
        }

        const article = clone.querySelector('.container-article');

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

        referencePotId.set(article, pot);

        fragmentPot.appendChild(clone);

    });

    return fragmentPot;

}




function feedPotsPage(data){

    const containerMain = document.querySelector('.container-main');
    const fragmentPot = createArticle(data);

    containerMain.appendChild(fragmentPot);

    const liSelected = Array.from(listHTMLColorTag).find( li => !li.classList.contains('used'));

    listHTMLColorTag.forEach( (li) => {

        if(li === liSelected){
            li.classList.add('selected');
            li.setAttribute('aria-selected', 'true');
        }
        else{
            li.classList.remove('selected');
            li.setAttribute('aria-selected', 'false');
        }

    });

}



/*** LISTENER ***/

const modalAdd = document.querySelector('.modal-add');
const modalDelete = document.querySelector('.modal-delete');
const modalAddwithdrawMoney = document.querySelector('.modal-addwithdraw-money');

let articleToEdit = null;
let articleToAddWithdraw = null;
let articleToDelete = null;


document.addEventListener('click', async (event) => {

    const btnToggleDropdown = event.target.closest('.button-edit');
    const btnOpenAddModal = event.target.closest('.open-add-modal');
    const btnOpenEditModal = event.target.closest('.open-edit-modal');
    const btnDeletePot = event.target.closest('.button-delete-budget');
    const btnAdd = event.target.closest('.button-add-money');
    const btnWithdraw = event.target.closest('.button-withdraw-money');
    const btnListSort = event.target.closest('.button-sort');
    const liColorTagModal = event.target.closest('.list-sort.color .li-sort');
    const btnCloseModal = event.target.closest('.close-modal');

    if(btnToggleDropdown){
        event.stopPropagation();
        toggleDropdownMenu(btnToggleDropdown);
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
        const btnColorTag = modalAdd.querySelector('.button-sort.color');
        const firstAvailable = Array.from(listHTMLColorTag).find(li => !li.classList.contains('used'));
        listHTMLColorTag.forEach(li => {
            const isTarget = (li === firstAvailable);
            li.classList.toggle('selected', isTarget);
            li.setAttribute('aria-selected', isTarget);
        });
        if (firstAvailable) {
            const theme = firstAvailable.dataset.sort;
            const themeName = firstAvailable.querySelector('.color-name').textContent;
            btnColorTag.querySelector('.color-tag').style.backgroundColor = theme;
            btnColorTag.querySelector('.color-name').textContent = themeName;
        }
        modalAdd.showModal();
    }

    if(btnOpenEditModal){
        const title = 'Edit Pot';
        const descriptionText = 'If your saving targets change, feel free to update your pots.';
        const buttonText = 'Save Changes';
        modalAdd.querySelector('.title').textContent = title;
        modalAdd.querySelector('.text:nth-of-type(1)').textContent = descriptionText;
        modalAdd.querySelector('.button-submit-modal').textContent = buttonText;

        //get the info
        const containerPot = event.target.closest('.container-article');
        articleToEdit = containerPot;
        const potData = referencePotId.get(containerPot);
        const  { name, target, theme, id } = potData;
        modalAdd.dataset.id = id;
        const labelCategory =  modalAdd.querySelector('.search-field label[for="potName"]');
        const inputCategory = labelCategory.querySelector('input');
        if(labelCategory){   
            inputCategory.value = name;
        }
        const inputTarget =  modalAdd.querySelector('.search-field label[for="maxspend"] input');
        if(inputTarget){
            inputTarget.value = target;
        }
        const themeName = colorTagsMap[theme].querySelector('.color-name').textContent ?? 'Unknown';

        listHTMLColorTag.forEach( (li) => {

            if(li.dataset.sort === theme){
                li.classList.add('selected');
                li.setAttribute('aria-selected', 'true');
            } 
            else{
                li.classList.remove('selected');
                li.setAttribute('aria-selected', 'false');
            }

        });
        
        const btnThemeText = modalAdd.querySelector('.button-sort.color');
        if(btnThemeText){
            btnThemeText.querySelector('.color-tag').style.backgroundColor = theme;
            btnThemeText.querySelector('.color-name').textContent = themeName;
        }

        event.target.closest('.dropdown').classList.remove('active');
        modalAdd.showModal();
    }

    if(btnAdd || btnWithdraw){
        //get the info
        const containerPot = event.target.closest('.container-article');
        articleToAddWithdraw = containerPot;
        const data = referencePotId.get(containerPot);
        addWithrawMoney(data, btnAdd || btnWithdraw, modalAddwithdrawMoney);
    } 

    if(btnDeletePot){
        articleToDelete = event.target.closest('.container-article');
        const category = referencePotId.get(articleToDelete).name;
        const categoryText = `Delete '${category}'?`;
        const contentText = 'Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever.';
        modalDelete.querySelector('.title').textContent = categoryText;
        modalDelete.querySelector('.text').textContent = contentText;
        event.target.closest('.dropdown').classList.remove('active');
        modalDelete.showModal();
    }

    //open the list to choose the color tag
    if(btnListSort){
        const container = event.target.closest('.container-sort');
        const currentList = container.querySelector('.list-sort');
        const isExpanded = btnListSort.classList.toggle('expanded');       
        if(isExpanded){
            btnListSort.setAttribute('aria-expanded', 'true');
            currentList.classList.add('active');
        }
        else{
            btnListSort.setAttribute('aria-expanded', 'false');
            currentList.classList.remove('active');
        }
    }

    //choose the color tag for the new pot
    if(liColorTagModal){
        chooseLiColorCategory(liColorTagModal);
    }

    if(btnCloseModal){
        closeModalAddEdit(btnCloseModal, event);
    }

});



/* INPUT */

const charLeftText = document.querySelector('.charLeft');
const inputName = document.querySelector('input[name="potName"]');

inputName.addEventListener('input', () => {
    const charLeftNumber = 30 - inputName.value.length;
    charLeftText.textContent = charLeftNumber;
});



/************************************ */
/****************POT GROCERIES BUG AFFICHAGE AVEC POT ******************** */
/************************************ */

/* SUBMIT */


const formPot = document.querySelector('#createForm');

formPot.addEventListener('submit', async (event) => {

    event.preventDefault();
    event.stopPropagation();

    const form = event.target;

    // console.log(form);
    
    const label = form.querySelectorAll('label');
    // console.log('label', label);
    
    const inputs = form.querySelectorAll('input');

    const results = Array.from(inputs).map( (input, index) => {
        // console.log(label[index]);
        // console.log('input', validateInput(input, label[index]));
        return validateInput(input, label[index]);
    });

    const isValid = results.every(res => res === true);

    if(!isValid){
        console.log('INVALID FORM');
        return;
    }

    console.log('VALID FORM');

    const theme = document.querySelector('.list-sort.color .selected').dataset.sort || null;

    if(theme === null){
        return;
    }

    const formData = new FormData(form);

    const potData = {
        name: formData.get('potName'),
        target: Number(formData.get('maxspend')),
        theme: theme
    };


    const potId = modalAdd.dataset.id;

    /************* ****************************** **************/
    /************* BLOQUER APPUIE SUBMIT AVEC DISABLED ET VOIR FONCTION TEMPS POUR LIMITER SUBMIT **************/
    /************* ******************************* **************/

    try{

        if(potId){ //EDIT

            const oldPotData = referencePotId.get(articleToEdit);

            //compare object to send
            const keysToCompare = Object.keys(potData);
            const hasChange = keysToCompare.some( key => potData[key] !== oldPotData[key] );

            if(hasChange){

                const updatedPot = await sendData(`http://localhost:3000/pots/${potId}`, potData, 'PATCH');              

                if(oldPotData.theme !== updatedPot.theme){
                    const liOldTag = colorTagsMap[oldPotData.theme];
                    if (liOldTag) {
                        liOldTag.classList.remove('used');
                        const statusLabel = liOldTag.querySelector('.isUsed');
                        if (statusLabel) statusLabel.textContent = '';
                    }
                }

                const articleUpdated = createArticle([updatedPot]).firstElementChild;
                if(articleUpdated){
                    articleToEdit.replaceWith(articleUpdated);                  
                }   

            }

            articleToEdit = null;

        }
        else{ //CREATE
            potData.total = 0;
            const newPot = await sendData('http://localhost:3000/pots', potData, 'POST');
            feedPotsPage([newPot]);
        }

        modalAdd.querySelector('#createForm').reset();

        modalAdd.close();
        delete modalAdd.dataset.id;

    } catch(error){
        console.error('Error sending data :', error.message);
        alert(`Impossible to create new Pot : ${error.message}`);
    }
    
});





const formAddWithdraw = document.querySelector('#addWithdrawForm');

formAddWithdraw.addEventListener('submit', async (event) => {

    event.preventDefault();
    event.stopPropagation();

    const form = event.target;

    const reference = referencePotId.get(articleToAddWithdraw);
    const id = reference.id;
    const currentTotal = reference.total;
    const operator =  modalAddwithdrawMoney.dataset.operator;//plus or minus


    const label = form.querySelectorAll('label');
    const inputs = form.querySelectorAll('input');

    const results = Array.from(inputs).map( (input, index) => {
        // console.log(label[index]);
        // console.log('input', validateInput(input, label[index]));
        return validateInput(input, label[index]);
    });

    const isValid = results.every(res => res === true);

    if(!isValid){
        console.log('INVALID FORM');
        return;
    }

    console.log('VALID FORM');


    const formData = new FormData(form);
    let newTotal;

    if(operator === 'minus'){
        newTotal = -Number(formData.get('amountToAddWithdraw'));
    }
    else{
        newTotal = Number(formData.get('amountToAddWithdraw'));
    }

    const amountData = {
        total: Math.max( 0, currentTotal + newTotal )
    };

    // console.log(reference.total);
    const isTotalDifferent = reference.total !== amountData.total;
    console.log('isTotalDifferent', isTotalDifferent);

    try{

        if(id && isTotalDifferent){

            const updatedPot = await sendData(`http://localhost:3000/pots/${id}`, amountData, 'PATCH');
            const articleUpdated = createArticle([updatedPot]).firstElementChild;

            if(articleUpdated){
                articleToAddWithdraw.replaceWith(articleUpdated);                  
            }

        }

    } catch(error) {
        console.error('Error sending data :', error.message);
        alert(`Impossible to create new Pot : ${error.message}`);
    }

    articleToAddWithdraw = null;
    delete modalAddwithdrawMoney.dataset.operator;
    
    modalAddwithdrawMoney.querySelector('#addWithdrawForm').reset();
    modalAddwithdrawMoney.close();

});




const formDelete = document.querySelector('#deletePot');

formDelete.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('articleToDelete', articleToDelete);
    const reference = referencePotId.get(articleToDelete);
    const id = reference.id;
    try{

        if(id){
            const updatedPot = await sendData(`http://localhost:3000/pots/${id}`, null, 'DELETE');
            articleToDelete.remove();
            articleToDelete = null;
        }

    } catch(error){
        console.error('Error sending data :', error.message);
        alert(`Impossible to create new Pot : ${error.message}`);
    }
    modalDelete.close();
});





/****INPUT****/

const labels = document.querySelectorAll('label');

labels.forEach( (label) =>  {
    const input = label.querySelector('input');
    input.addEventListener('input', () => {
        label.classList.remove('error');
    });
});





/********************************************/
/********************************************/
/* - Pots
  - Adding money to a pot should deduct the given amount from the current balance (seen on the Overview page).
  - Withdrawing money from a pot should add that amount to the current balance.
  - Deleting a pot should return all the money from the pot to the current balance. */
/********************************************/
/********************************************/




