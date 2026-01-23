

import { getData } from './data-service.js';

import { setupSideMenu, openSortListModal, setupDropdownMenu } from './ui-utils.js';




( async () => {

    try{

        setupSideMenu();

        const data = await getData.fetchData('../data.json');
        console.log(data);
        feedbudgetPage(data);

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



function feedbudgetPage(data){


    /* BUDGETS */

    //Extract Budget

    const budgetAmountbyCategory = new Map();

    data.budgets.forEach( (budget) => {
        budgetAmountbyCategory.set(budget.category, 0);
    });

    data.transactions.forEach( (transaction) => {
        if(budgetAmountbyCategory.has(transaction.category)){
            const currentAmount = budgetAmountbyCategory.get(transaction.category);
            budgetAmountbyCategory.set(transaction.category, currentAmount + Math.abs(transaction.amount));
        }
    });


    //chart create SVG

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

    const maxBudget = data.budgets.reduce( (acc, budget) => {
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

    data.budgets.forEach( (budget) => {

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



    //list under the svg chart

    const budgetCategories = data.budgets.map(budget => budget.category);
    const categorySet = new Set(budgetCategories);

    const amountByCategory = data.transactions.reduce( (acc, transaction) => {

        if (categorySet.has(transaction.category)) {
            return acc + transaction.amount;
        }
        return acc;

    }, 0);


    const budgetsTotal = document.querySelector('.section-budgets .text');
    const budgetsSpend = budgetsTotal.querySelector('.spend');
    const budgetsTotalSpend = budgetsTotal.querySelector('.total-spend');

    const totalSpend = data.budgets.reduce( (acc, budget) => acc + budget.maximum, 0);
    if(budgetsTotalSpend) budgetsTotalSpend.textContent = `of $${totalSpend} limit`;

    budgetsSpend.textContent = `$${Math.floor(Math.abs(amountByCategory))}`;



    /* CREATE ARTICLE */

    const budgetsList = document.querySelector('.section-budgets .list-pots');
    // const budgetsLiElements = budgetsList.querySelectorAll('.li-pots');    

    const fragment = document.createDocumentFragment();
    const templateLiPots = document.querySelector('#template-li-pots');

    data.budgets.forEach( (budget) => {

        const clone = templateLiPots.content.cloneNode(true);
        const li = clone.querySelector('.li-pots');
        // console.log(clone);

        li.querySelector('.border').style.backgroundColor = budget.theme;
        li.querySelector('.budget-category').textContent = budget.category;
        const spent = budgetAmountbyCategory.get(budget.category) || 0;

        li.querySelector('.budget-spent').textContent = `$${spent.toFixed(2)}`;
        li.querySelector('.budget-amount-max').textContent = `$${budget.maximum.toFixed(2)}`;

        fragment.appendChild(clone);

    });

    budgetsList.appendChild(fragment);

    const containerArticle = document.querySelector('.display-container-article');
    const fragmentArticleBudget = document.createDocumentFragment();
    const templateArticleBudget = document.querySelector('#template-latest-spending');


    data.budgets.forEach( (budget) => {

        const clone = templateArticleBudget.content.cloneNode(true);
        const header = clone.querySelector('.container-header-title');

        header.querySelector(`.article-title`).textContent = budget.category;
        header.querySelector(`.color-tag`).style.backgroundColor = budget.theme;

        const containerGraph = clone.querySelector('.container-graph');
        containerGraph.querySelector('.amount-spent').textContent = budget.maximum;


        const lengthGraph =  Math.min((budgetAmountbyCategory.get(budget.category) / budget.maximum ) * 100, 100);
        containerGraph.querySelector('.line-graph').style.width = `${lengthGraph}%`;
        containerGraph.querySelector('.line-graph').style.backgroundColor = budget.theme;
        containerGraph.querySelector('.border').style.backgroundColor = budget.theme;

        const spent = budgetAmountbyCategory.get(budget.category) || 0;
        containerGraph.querySelector('.list-pots .total-spent').textContent = `$${spent.toFixed(2)}`;
        containerGraph.querySelector('.list-pots .free').textContent = `$${budget.maximum}`;

        const spendingList = clone.querySelector('.list-spending');
        const innerTemplate = clone.querySelector('#template-li-spending');

        const lastThreeTransactions = data.transactions.filter(t => t.category === budget.category)
                                                        .sort((a, b) => new Date(b.date) - new Date(a.date))                                                
                                                        .slice(0, 3);

        // console.log('lastThreeTransactions : ', lastThreeTransactions);

        lastThreeTransactions.forEach( (transaction) => {

            const cloneLi = innerTemplate.content.cloneNode(true);

            if (transaction.avatar.startsWith('../')) {
                cloneLi.querySelector('.logo-spending').src = transaction.avatar;
                cloneLi.querySelector('.logo-spending').alt = `Avatar de ${transaction.name}`;
            }            

            cloneLi.querySelector('.category').textContent = transaction.name;
            cloneLi.querySelector('.price').textContent = `-$${Math.abs(transaction.amount).toFixed(2)}`;

            const formattedDate = new Date(transaction.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            cloneLi.querySelector('.date').textContent = formattedDate;  
            
            spendingList.appendChild(cloneLi);

        });

        fragmentArticleBudget.appendChild(clone);

    })

    containerArticle.appendChild(fragmentArticleBudget);














    


    /* ADD NEW BUDGET */

    //open modal

    const modalAddEdit = document.querySelector('.modal-add');
    const btnAddBudget = document.querySelector('.add-budget');

    const modalTitle = modalAddEdit.querySelector('.title');
    const modalText = modalAddEdit.querySelector('.text:nth-of-type(1)');

    const btnSubmitModal = modalAddEdit.querySelector('.modal-add .button-submit-modal');

    btnAddBudget.addEventListener('click', () => {

        modalTitle.textContent = 'Add New Budget';
        modalText.textContent = 'Choose a category to set a spending budget. These categories can help you monitor spending.';
        btnSubmitModal.textContent = 'Add Budget';
        modalAddEdit.showModal();

    });







    //close modal

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




    /* OPEN ADD LIST BUTTON MODAL */

    const btnSort = document.querySelectorAll('.button-sort');
    const listSort = document.querySelectorAll('.list-sort');

    openSortListModal(btnSort, listSort);


    /* OPEN CLOSE DROPDOWN MENU */

    setupDropdownMenu();


}





