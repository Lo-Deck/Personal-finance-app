

( async () => {

    try{

        const data = await getData.fetchData('../data.json');
        console.log(data);
        feedPotsPage(data);

    } catch(error) {

        console.error('Error download data :', error.message);
        // document.body.innerHTML += "<p>Erreur de chargement</p>";
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