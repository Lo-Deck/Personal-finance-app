


const transactionsPage = document.querySelector('.transactions-page');
const recurringPage = document.querySelector('.recurring-page');
const budgetPage = document.querySelector('.budgets');
const potsPage = document.querySelector('.pots-page');



// const dropdownMenu = document.querySelectorAll('.dropdown');


const btnEditBudget = document.querySelectorAll('.button-edit-budget');
const btnDeleteBudget = document.querySelectorAll('.button-delete-budget');





/* MODAL */

// const modalAddEdit = document.querySelector('.modal-add');
const modalDelete = document.querySelector('.modal-delete');

const btnSubmitModal = document.querySelector('.button-submit-modal');


// const btnCloseModal = document.querySelector('.close-modal');

const modalTitle = modalAddEdit.querySelector('.title');
const modalText = modalAddEdit.querySelector('.text:nth-of-type(1)');
const modalButton = modalAddEdit.querySelector('.button-modal');



const modalDeleteTitle = modalDelete.querySelector('.title');
const modalDeleteText = modalDelete.querySelector('.text:nth-of-type(1)');
const modalDeleteButtonConfirm = modalDelete.querySelector('.modal-delete .button-modal:nth-of-type(1)');
const modalDeleteButtonCancel = modalDelete.querySelector('.modal-delete .button-modal:nth-of-type(2)');




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


    

    const btnCloseModal = document.querySelector('.close-modal');

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



