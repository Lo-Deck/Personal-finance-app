



const containerHeader = document.querySelector('.container-header');
const btnExtendMenu = document.querySelector('.button-extend-menu');



const transactionsPage = document.querySelector('.transactions-page');
const recurringPage = document.querySelector('.recurring-page');
const budgetPage = document.querySelector('.budgets');
const potsPage = document.querySelector('.pots-page');


const btnSort = document.querySelectorAll('.button-sort');
const listSort = document.querySelectorAll('.list-sort');



const btnAddBudget = document.querySelector('.add-budget');
const btnAddPot = document.querySelector('.add-pot');



const btnDropdownMenu = document.querySelectorAll('.button-edit');
const dropdownMenu = document.querySelectorAll('.dropdown');


    
const btnEditBudget = document.querySelectorAll('.button-edit-budget');
const btnDeleteBudget = document.querySelectorAll('.button-delete-budget');




/* MENU HEADER */

let isBtnMenuClicked = false;

btnExtendMenu.addEventListener('click', () => {

    isBtnMenuClicked = !isBtnMenuClicked;

    if(isBtnMenuClicked){
        containerHeader.classList.add('reduce');
        containerHeader.classList.remove('large');
    } else {
        containerHeader.classList.remove('reduce');
        containerHeader.classList.add('large');
    }
 
});





// if(transactionsPage){
// if(transactionsPage || recurringPage){

    btnSort.forEach( ( item, index ) => {

        item.addEventListener('click', () => {

            for(let i = 0; i < btnSort.length; i++){

                if(i === index){
                    listSort[i].classList.toggle('active');     

                } else {
                    listSort[i].classList.remove('active');     
                }

            }

        });

    });

// }




/* MODAL */

const modalAddEdit = document.querySelector('.modal-add');
const modalDelete = document.querySelector('.modal-delete');

const btnModal = document.querySelector('.button-modal');
const btnCloseModal = document.querySelector('.close-modal');

const modalTitle = modalAddEdit.querySelector('.title');
const modalText = modalAddEdit.querySelector('.text:nth-of-type(1)');
const modalButton = modalAddEdit.querySelector('.button-modal');

const modalDeleteTitle = modalDelete.querySelector('.title');
const modalDeleteText = modalDelete.querySelector('.text:nth-of-type(1)');
const modalDeleteButtonConfirm = modalDelete.querySelector('.modal-delete .button-modal:nth-of-type(1)');
const modalDeleteButtonCancel = modalDelete.querySelector('.modal-delete .button-modal:nth-of-type(2)');


if(budgetPage){

    btnAddBudget.addEventListener('click', () => {

        modalTitle.textContent = 'Add New Budget';
        modalText.textContent = 'Choose a category to set a spending budget. These categories can help you monitor spending.';
        modalButton.textContent = 'Add Budget';

        modalAddEdit.showModal();

    })

}



if(budgetPage || potsPage){

    btnEditBudget.forEach( (btn, index) => {

        btn.addEventListener('click', (event) => {

            if(budgetPage){
                modalTitle.textContent = 'Edit Budget';
                modalText.textContent = 'As your budgets change, feel free to update your spending limits.';
                modalButton.textContent = 'Save Changes';
            }

            if(potsPage){
                modalTitle.textContent = 'Edit Pot';
                modalText.textContent = 'If your saving targets change, feel free to update your pots.';
                modalButton.textContent = 'Save Changes';
            }

            const category = event.currentTarget.closest('.container-header-title').querySelector('.article-title').textContent;

            const btnCategoryList = modalAddEdit.querySelector('.search-field .container-sort:nth-of-type(1) .button');
    
            btnCategoryList.querySelector('span').textContent = category;
            btnCategoryList.disabled = true;
            btnCategoryList.style.opacity = '0.5';
            btnCategoryList.style.pointerEvents = 'none';
            btnCategoryList.style.cursor = 'not-allowed';

            dropdownMenu[index].classList.remove('active');   

            modalAddEdit.showModal();

            console.log('**********btn, index', btn, index); 

        })

    })


    btnCloseModal.addEventListener('click', () => {

        const btnCategoryList = modalAddEdit.querySelector('.search-field .container-sort:nth-of-type(1) .button');

        btnCategoryList.disabled = false;
        btnCategoryList.style.opacity = '1';
        btnCategoryList.style.pointerEvents = 'auto';
        btnCategoryList.style.cursor = 'pointer';

        modalAddEdit.querySelectorAll('.list-sort').forEach( (item, index) => {
            item.classList.remove('active');
        })

    })


    btnDeleteBudget.forEach( (btn, index) => {

        btn.addEventListener('click', (event) => {

            const category = event.currentTarget.closest('.container-header-title').querySelector('.article-title').textContent;

            console.log('category modal-delete', category);
            
            if(budgetPage){
                modalDeleteTitle.textContent = `Delete '${category}'?`;
                modalDeleteText.textContent = 'Are you sure you want to delete this budget? This action cannot be reversed, and all the data inside it will be removed forever.';
            }

            if(potsPage){
                modalDeleteTitle.textContent = `Delete '${category}'?`;
                modalDeleteText.textContent = 'Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever.';
            }

            dropdownMenu[index].classList.remove('active');

            modalDelete.showModal();

        })

    })

}



if(potsPage){


    const modalAddMoney = document.querySelector('.modal-add-money');
    const modalWithdrawMoney = document.querySelector('.modal-withdraw-money');

    const btnAddMoney = document.querySelectorAll('.amount-saved .button:nth-of-type(1)');
    const btnWithdrawMoney = document.querySelectorAll('.amount-saved .button:nth-of-type(2)');

    const modalWithdrawMoneyTitle = modalWithdrawMoney.querySelector('.title');
    // const modalWithdrawMoneyText = modalAddMoney.querySelector('.text:nth-of-type(1)');
    const modalAddMoneyTitle = modalAddMoney.querySelector('.title');
    // const modalAddMoneyText = modalAddMoney.querySelector('.text:nth-of-type(1)');


    btnAddPot.addEventListener('click', () => {
        modalTitle.textContent = 'Add New Pot';
        modalText.textContent = 'Create a pot to set savings targets. These can help keep you on track as you save for special purchases.';
        modalButton.textContent = 'Add Pot';
        modalAddEdit.showModal();
    })   



    btnAddMoney.forEach( (btn) => {

        btn.addEventListener('click', (event) => {
            
            const category = event.currentTarget.closest('.container-article').querySelector('.container-header-title .article-title').textContent;

            modalAddMoneyTitle.textContent = `Add from '${category}'`;

            modalAddMoney.showModal();

        })

    })


    btnWithdrawMoney.forEach( (btn) => {

        btn.addEventListener('click', (event) => {

            const category = event.currentTarget.closest('.container-article').querySelector('.container-header-title .article-title').textContent;

            modalWithdrawMoneyTitle.textContent = `Withdraw from '${category}'`;
            
            modalWithdrawMoney.showModal();
      
        })

    })





}


/* EDIT */

btnDropdownMenu.forEach( (btn, index, array) => {

    btn.addEventListener('click', () => {
        for(let i = 0; i < array.length; i++){
            i === index ? dropdownMenu[i].classList.toggle('active') : dropdownMenu[i].classList.remove('active');
        }
    })

})

