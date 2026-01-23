

import { getData } from './data-service.js';
import { setupSideMenu, addWithrawMoney, openSortListModal, setupDropdownMenu } from './ui-utils.js';


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







    /* ADD NEW POT */

    const btnAddPot = document.querySelector('.add-pot');

    const modalAddPot = document.querySelector('.modal-add');
    const modalTitle = modalAddPot.querySelector('.title');
    const modalText = modalAddPot.querySelector('.text:nth-of-type(1)');
    const modalButton = modalAddPot.querySelector('.button-submit-modal');
        
    btnAddPot.addEventListener('click', () => {
        modalTitle.textContent = 'Add New Pot';
        modalText.textContent = 'Create a pot to set savings targets. These can help keep you on track as you save for special purchases.';
        modalButton.textContent = 'Add Pot';
        modalAddPot.showModal();
    }) 




    /* OPEN ADD WIHDRAW BUTTON */

    const modalAddMoney = document.querySelector('.modal-add-money');
    const modalWithdrawMoney = document.querySelector('.modal-withdraw-money');

    containerMain.addEventListener('click', (event) => {

        const btnAdd = event.target.closest('.button-add-money');
        const btnWithdraw = event.target.closest('.button-withdraw-money');

        if(btnAdd){
            addWithrawMoney(event, btnAdd, modalAddMoney);
        } 

        if(btnWithdraw){
            addWithrawMoney(event, btnWithdraw, modalWithdrawMoney);
        }

    });



    /* OPEN ADD LIST BUTTON MODAL */

    const btnSort = document.querySelectorAll('.button-sort');
    const listSort = document.querySelectorAll('.list-sort');

    openSortListModal(btnSort, listSort);




    /* OPEN CLOSE DROPDOWN MENU */

    setupDropdownMenu();




}