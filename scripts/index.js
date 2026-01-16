

( async () => {

    try{

        const data = await getData.fetchData('../data.json');
        console.log(data);
        feedIndexPage(data);

    } catch(error) {

        console.error('Error download data :', error.message);
        // document.body.innerHTML += "<p>Erreur de chargement</p>";
    }

})()



function feedIndexPage(data){


    /* HEADER */

    const containerExpenses = document.querySelector('.container-expenses');

    if (containerExpenses) {
        containerExpenses.querySelector('.expenses.balance .amount').textContent = `$${data.balance.current.toFixed(2)}`;
        containerExpenses.querySelector('.expenses.income .amount').textContent = `$${data.balance.income.toFixed(2)}`;
        containerExpenses.querySelector('.expenses.expense .amount').textContent = `$${data.balance.expenses.toFixed(2)}`;
    }






    /* POTS */
     
    const potsTotalSaved = document.querySelector('.total-saved .text');
    const potsList = document.querySelector('.section-pots .list-pots');
    const potsElements = potsList.querySelectorAll('.li-pots');

    const totalSaved = data.pots.reduce( (acc, pot) => acc + pot.total, 0);
    if(potsTotalSaved) potsTotalSaved.textContent = `$${totalSaved}`;

    for(let i = 0; i < 4; i++){
        potsElements[i].querySelector('.border').style.backgroundColor = data.pots[i].theme;
        potsElements[i].querySelector('.text').textContent = data.pots[i].name;
        potsElements[i].querySelector('span').textContent = `$${data.pots[i].total}`;
    }





    /* TRANSACTIONS */

    const containerTransactions = document.querySelector('.container-transactions');
    const template = document.querySelector('#transaction-template');


    data.transactions.slice(0, 5).forEach( (transaction) => {

        const clone = template.content.cloneNode(true);

        clone.querySelector('.text').textContent = transaction.name;

        if (transaction.avatar.startsWith('../')) {
            clone.querySelector('.avatar').src = transaction.avatar;
            clone.querySelector('.avatar').alt = `Avatar de ${transaction.name}`;
        }

        if( transaction.amount >= 0 ){
            clone.querySelector('.price').textContent = `$${transaction.amount.toFixed(2)}`;
            clone.querySelector('.price').classList.add('plus');
        } else {
            clone.querySelector('.price').textContent = `-$${Math.abs(transaction.amount).toFixed(2)}`;
        }

        const formattedDate = new Date(transaction.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        clone.querySelector('.date').textContent = formattedDate;

        containerTransactions.appendChild(clone);

    })
    









    /* BUDGETS */

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


    console.log(budgetAmountbyCategory);
    

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
    // console.log(maxBudget);


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



    // const budgetChartHover = document.querySelector('.budget-chart');


    

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



        //hover
        
        g.addEventListener('mousemove', (event) => {

            const rect = g.getBoundingClientRect();

            // const budgetChartHover = document.querySelector('.budget-chart');
            // const rect = budgetChartHover.getBoundingClientRect();

            const mouseXRelative = event.clientX - rect.left;
            const mouseYRelative = event.clientY - rect.top;

            chartHover.style.display = 'flex';

            chartHover.style.left = `${mouseXRelative + 15}px`;
            chartHover.style.top = `${mouseYRelative + 15}px`;

            chartHoverIcon.style.backgroundColor = budget.theme
            chartHoverCategory.textContent = budget.category;
            chartHoverCategoryAmount.textContent = `Budget Spent: $${budgetAmountbyCategory.get(budget.category)}`;
            chartHoverCategoryTotal.textContent = `Budget Maximum: $${budget.maximum}`;

        });

        // g.addEventListener('mouseenter', (event) => {

        //     chartHover.style.display = 'flex';

        //     // console.log(event.clientX);
        //     // console.log(event.clientY);

        //     const rect = document.querySelector('.chart-hover').getBoundingClientRect();
        //     console.log('rect', rect);

        //     const mouseXRelative = event.clientX - rect.left;
        //     const mouseYRelative = event.clientY - rect.top;
        //     console.log('mouseXRelative :', mouseXRelative);
        //     console.log('mouseYRelative :', mouseYRelative);

        //     chartHover.style.left = `${mouseXRelative + 15}px`;
        //     chartHover.style.top = `${mouseYRelative + 15}px`;

        //     chartHoverIcon.style.backgroundColor = budget.theme
        //     chartHoverCategory.textContent = budget.category;
        //     chartHoverCategoryAmount.textContent = `Budget Spent: $${budgetAmountbyCategory.get(budget.category)}`;
        //     chartHoverCategoryTotal.textContent = `Budget Maximum: $${budget.maximum}`;

        // });

        g.addEventListener('mouseleave', () => {
            chartHover.style.display = 'none';
        });
        


    });







    
    //list

    const budgetCategories = data.budgets.map(budget => budget.category);
    // console.log('budgetCategories: ', budgetCategories );
    const categorySet = new Set(budgetCategories);
    // console.log(categorySet);    

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


    const budgetsList = document.querySelector('.section-budgets .list-pots');
    const budgetsLiElements = budgetsList.querySelectorAll('.li-pots');

    for(let i = 0; i < 4; i++){
        budgetsLiElements[i].querySelector('.border').style.backgroundColor = data.budgets[i].theme;
        budgetsLiElements[i].querySelector('.text').textContent = data.budgets[i].category;
        budgetsLiElements[i].querySelector('span').textContent = `$${data.budgets[i].maximum.toFixed(2)}`;
    }

    



    

    /* RECURRING */

    let paidBills = 0;
    let totalUpcoming = 0;
    let dueSoon = 0;    

    let billRecurring = new Map();

    data.transactions.forEach( (transaction) => {
        if( transaction.recurring ){
            billRecurring.set(transaction.name, transaction);
        }
    });


    let currentDate = new Date("August 19, 2024");
    const today = currentDate.getDate();
    const referenceDate = new Date(currentDate);
    const dayPlusFive = new Date(referenceDate);
    dayPlusFive.setDate(referenceDate.getDate() + 5);
    const daydueSoon = dayPlusFive.getDate();
   

    billRecurring.forEach( (bill, index) => {

        billDate = new Date(bill.date).getDate();
        const amount = Math.abs(bill.amount);

        if( billDate <= today ){
            paidBills += amount;
        } else {
            totalUpcoming += amount;
            if(billDate <= daydueSoon){
                dueSoon += amount;
            }
        }

    })

    // console.log('paidBills', paidBills);
    // console.log('totalUpcoming', totalUpcoming);
    // console.log('dueSoon', dueSoon);

    const containerRecurring = document.querySelector('.article-recurring'); 
    const paid = containerRecurring.querySelector('.bills.paid .price');
    const upcoming = containerRecurring.querySelector('.bills.upcoming .price');
    const due = containerRecurring.querySelector('.bills.due .price');

    paid.textContent = `$${paidBills.toFixed(2)}`;
    upcoming.textContent = `$${totalUpcoming.toFixed(2)}`;
    due.textContent = `$${dueSoon.toFixed(2)}`;


}

