

( async () => {

    try{

        const data = await getData.fetchData('../data.json');
        console.log(data);
        feedRecurringPage(data);

    } catch(error) {

        console.error('Error download data :', error.message);
        // document.body.innerHTML += "<p>Erreur de chargement</p>";
    }

})()



function feedRecurringPage(data){

    let paidBills = 0;
    let paid = 0;
    let totalUpcoming = 0;
    let upcoming = 0;
    let dueSoon = 0;
    let soon = 0;


    const recurringBill = new Map();


    data.transactions.sort( (a, b) => {
        const dayA = new Date(a.date).getDate();
        const dayB = new Date(b.date).getDate();
        return dayA - dayB;
    }).forEach( (transaction) => {
            if(transaction.recurring){
                recurringBill.set(transaction.name, transaction);
            }
    });



    console.log(recurringBill);

    // recurringBill.forEach( (bill) => {
    //     console.log('bill :', bill);
    // });

    // console.log(Array.from(recurringBill.values()));

    const totalBill = Array.from(recurringBill.values()).reduce( (acc, transaction) => {
        return acc + Math.abs(transaction.amount);
    }, 0);
    
    // console.log('totalBill: ', totalBill); 
    
    const currentDate = new Date('2024-08-19T00:00:00');
    // console.log('currentDate: ', currentDate);
    const today = currentDate.getDate();
    const referenceDate = new Date(currentDate);
    const dayPlusFive = new Date(referenceDate);
    dayPlusFive.setDate(referenceDate.getDate() + 5);
    const daydueSoon = dayPlusFive.getDate();


    recurringBill.forEach( (bill, index) => {

        billDate = new Date(bill.date).getDate();
        const amount = Math.abs(bill.amount);

        if(billDate <= today){
            paidBills += amount;
            paid++;
        } else {
            totalUpcoming += amount;
            upcoming++;
            if(billDate <= daydueSoon){
                dueSoon += amount;
                soon++;
            }
        }

    });

    // console.log('paidBills: ', paidBills);
    // console.log('totalUpcoming: ', totalUpcoming);
    // console.log('dueSoon: ', dueSoon);
    
    const articleHeader = document.querySelector('.article-header');
    articleHeader.querySelector('.total-bill').textContent = `$${totalBill.toFixed(2)}`;

    // console.log(articleHeader.querySelector('.paid .price'));
    
    articleHeader.querySelector('.paid .price').textContent = `${paid}($${paidBills.toFixed(2)})`;
    articleHeader.querySelector('.upcoming .price').textContent = `${upcoming}($${totalUpcoming.toFixed(2)})`;
    articleHeader.querySelector('.due .price').textContent = `${soon}($${dueSoon.toFixed(2)})`;


    

    const fragmentBill = document.createDocumentFragment();
    const templateBill = document.querySelector('#template-transaction');

    const containerTransactions = document.querySelector('.container-transactions');


    recurringBill.forEach( (transaction) => {

        const clone = templateBill.content.cloneNode(true);

        // console.log(transaction);
        // console.log(clone);

        if(transaction.avatar && transaction.avatar.startsWith('../')){
            clone.querySelector('.avatar').src = transaction.avatar;            
        }

        clone.querySelector('.cell-name .text').textContent = transaction.name; 
        clone.querySelector('.cell-amount .text').textContent = `$${Math.abs(transaction.amount).toFixed(2)}`;            

        let billDate = new Date(transaction.date).getDate();
        // console.log('billDate', billDate);

        let textDate;

        switch(billDate){

            case 1:
                textDate = `Monthly-${billDate}st`;
                break;

            case 2:
                textDate = `Monthly-${billDate}nd`;
                break;

            case 3:
                textDate = `Monthly-${billDate}rd`;
                break;

            default:
                textDate = `Monthly-${billDate}th`;
                break;

        }

        // console.log('billDate', billDate);

        clone.querySelector('.cell-date time').textContent = textDate;        

        if(billDate <= today){
            clone.querySelector('.logo-paid').src = "../assets/images/icon-bill-paid.svg";

            console.log(clone.querySelector('.cell-date time'));
            
            clone.querySelector('.cell-date time').classList.add('green');
            //text vert

        } 
        else if(billDate <= daydueSoon){
            clone.querySelector('.logo-paid').src="../assets/images/icon-bill-due.svg";                
            // text rouge     
            clone.querySelector('.cell-amount .text').classList.add('red');
        }        
        
        else {

            // clone.querySelector('.logo-paid').src="../assets/images/icon-bill-due.svg";
            
            clone.querySelector('.logo-paid').style.display = "none";
            
        }

        fragmentBill.appendChild(clone);

    });

    containerTransactions.appendChild(fragmentBill);

}