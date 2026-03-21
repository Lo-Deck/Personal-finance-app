

import { getData, sendData } from './data-service.js';
import { setupSideMenu, addWithrawMoney, toggleDropdownMenu, closeAllDropdowns, closeModalAddEdit, chooseLiColorCategory, validateInput, goThroughFocus, sanitizeData, displayPopup } from './ui-utils.js';


const colorTagsMap = {};//keep track of the color
const referencePotId = new WeakMap();
const listHTMLColorTag = document.querySelectorAll('.list-sort.color .li-sort');


let data;

( async () => {

    try{

        setupSideMenu()

        const [ balance, pots ] = await Promise.all ([
            getData.fetchData('/finances/balance'),
            getData.fetchData('/finances/pots')
        ]);

        data = {
            balance: balance.balance,
            pots: pots.pots
        };

        sanitizeData(data);
        
        listHTMLColorTag.forEach( (li) => {
            colorTagsMap[li.dataset.sort] = li;
        });

        feedPotsPage(data.pots);

    } catch(error) {
        // console.error('CRITICAL APP ERROR:', error.message);
        // console.error('CRITICAL APP ERROR:', error.stack);

        const container = document.querySelector('.container-main');
        container.innerHTML = '';
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';

        const p = document.createElement('p');
        p.textContent = '!!! Impossible to download data !!!';
        p.style.fontSize = '2rem';
        p.style.marginTop = '5rem';
        p.style.color = 'red';

        const button = document.createElement('button');
        button.textContent = 'Retry';
        button.style.fontSize = '2rem';
        button.style.marginTop = '1rem';
        button.style.padding = '0.5rem';
        button.style.border = '2px solid red';
        button.style.color = 'red';
        button.onclick = () => location.reload();

        errorDiv.appendChild(p);
        errorDiv.appendChild(button);
        container.appendChild(errorDiv);

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




/* SUBMIT */

const formPot = document.querySelector('#createForm');

formPot.addEventListener('submit', async (event) => {

    event.preventDefault();
    event.stopPropagation();

    const form = event.target;
    const label = form.querySelectorAll('label');
    const inputs = form.querySelectorAll('input');
    const results = Array.from(inputs).map( (input, index) => {
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
        target: Number(formData.get('maxspend').replace(',', '.')),
        theme: theme
    };

    // const potId = modalAdd.dataset.id;
    
    const potId = modalAdd ? modalAdd.dataset.id : null;

    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try{

        if(potId){ //EDIT

            const oldPotData = referencePotId.get(articleToEdit);

            //compare object to send
            const keysToCompare = Object.keys(potData);
            const hasChange = keysToCompare.some( key => potData[key] !== oldPotData[key] );

            if(hasChange){

                const updatedPot = await sendData(`/finances/updatePot/${potId}`, potData, 'PATCH');

                if(oldPotData.theme !== updatedPot.updatedPot.theme){
                    const liOldTag = colorTagsMap[oldPotData.theme];
                    if (liOldTag) {
                        liOldTag.classList.remove('used');
                        const statusLabel = liOldTag.querySelector('.isUsed');
                        if (statusLabel) statusLabel.textContent = '';
                    }
                }

                const articleUpdated = createArticle([updatedPot.updatedPot]).firstElementChild;
                if(articleUpdated){
                    articleToEdit.replaceWith(articleUpdated);                  
                }   

                // alert(`${updatedPot.message} : ${updatedPot.updatedPot.name} `);
                await displayPopup( `Pot edited`, `${updatedPot.updatedPot.name}`, updatedPot.updatedPot.theme);
                
            }

            submitBtn.disabled = false;

            articleToEdit = null;

        }
        else{ //CREATE
            potData.total = 0;
            const newPot = await sendData('/finances/addNewPot', potData, 'POST');

            submitBtn.disabled = false;

            // alert(`${newPot.message} : ${newPot.newPot.name} `);
            await displayPopup( `Pot created`, `${newPot.newPot.name}`, newPot.newPot.theme);

            feedPotsPage([newPot.newPot]);
        }

        modalAdd.querySelector('#createForm').reset();

        modalAdd.close();
        delete modalAdd.dataset.id;

    } catch(error){
        console.error('Error sending data :', error.message);
        submitBtn.disabled = false;
        alert(`An error occurred with the Pot: ${error.message}`);
    }
    
});






const formAddWithdraw = document.querySelector('#addWithdrawForm');

formAddWithdraw.addEventListener('submit', async (event) => {

    event.preventDefault();
    event.stopPropagation();

    const form = event.target;
    const reference = referencePotId.get(articleToAddWithdraw);

    // const id = reference.id;
    const id = reference ? reference.id : null;

    if(!id) {
        console.error("No ID found for deletion");
        modalAddwithdrawMoney.close();
        return; 
    }

    const currentTotal = reference.total;
    const operator =  modalAddwithdrawMoney.dataset.operator;//plus or minus

    const label = form.querySelectorAll('label');
    const inputs = form.querySelectorAll('input');

    const results = Array.from(inputs).map( (input, index) => {
        return validateInput(input, label[index]);
    });

    const isValid = results.every(res => res === true);

    if(!isValid){
        return;
    }

    const formData = new FormData(form);
    const amountData = {
        amount: operator === 'minus' ? -Number(formData.get('amountToAddWithdraw').replace(',', '.')) : Number(formData.get('amountToAddWithdraw').replace(',', '.'))
    };

    // console.log('BEFORE SENDING to SERVER amountData ', amountData);
    
    const isTotalDifferent = reference.total !== (reference.total + amountData.amount);

    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try{

        if(id && isTotalDifferent){

            const response = await sendData(`/finances/updateMoneypot/${id}`, amountData, 'PATCH');

            if(response && response.updatedPot){

                const newBalance = Number(response.updatedBalance.current);
                if(!isNaN(newBalance)){
                    data.balance.current = newBalance;
                }

                const articleUpdated = createArticle([response.updatedPot]).firstElementChild;
                if(articleUpdated){
                    articleToAddWithdraw.replaceWith(articleUpdated);                  
                }        

                submitBtn.disabled = false;

            }

        }
        else{
            submitBtn.disabled = false;
        }

    } catch(error) {
        console.error('Error sending data :', error.message);
        submitBtn.disabled = false;
        alert(`Impossible to update money pot : ${error.message}`);
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

    const reference = referencePotId.get(articleToDelete);

    const id = reference ? reference.id : null;

    if(!id) {
        console.error("No ID found for deletion");
        modalDelete.close();
        return;
    }

    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try{

        // if(id){
            const response = await sendData(`/finances/deletePot/${id}`, null, 'DELETE');
            // console.log('response', response);

            if(response && response.deletedPot){

                data.balance.current = response.deletedPot.updatedBalance.current;
                articleToDelete.remove();
                articleToDelete = null;
                submitBtn.disabled = false;
                // alert(`${response.message} : ${response.deletedPot.deletedPot.name} `);
                await displayPopup( `Pot deleted`, `${response.deletedPot.deletedPot.name}`, response.deletedPot.deletedPot.theme);
                
            }

        // }

    } catch(error){
        console.error('Error sending data :', error.message);
        submitBtn.disabled = false;
        alert(`Impossible to delete Pot : ${error.message}`);
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



/**** FOCUS ****/

goThroughFocus();
