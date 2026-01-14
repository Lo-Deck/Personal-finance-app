



const containerHeader = document.querySelector('.container-header');
const btnExtendMenu = document.querySelector('.button-extend-menu');



/* FETCH + DISPLAY TEXT PAGE */

    /* Quand le serveur envoie le fichier data.json, 
    il ajoute une consigne dans l'en-tête (Header) : Cache-Control: public, 
    max-age=3600 (ce qui signifie : "Gardez ce fichier en cache pendant 1 heure"). */

// const DataService = {
//     _data: null, // Variable "privée" pour le cache mémoire

//     async getData(url) {
//         // Si la donnée est déjà chargée dans cette session, on la rend direct
//         if (this._data) return this._data;

//         try {
//             const response = await fetch(url);
//             if (!response.ok) throw new Error("Erreur réseau");
            
//             this._data = await response.json();
//             return this._data;
//         } catch (error) {
//             console.error("DataService Error:", error);
//             throw error; // On propage l'erreur pour que la page puisse l'afficher
//         }
//     }
// };


// let cachedData = null;

// async function fetchData(url){

//     if(cachedData){
//         console.log('data cached');
//         return cachedData;
//     }

//     const response = await fetch(url);

//     if(!response.ok){
//         throw new Error (`Erreur HTTP: ${response.status}`);
//     }

//     cachedData = await response.json();
//     return cachedData;
// }



const getData = {

    cachedData : null,

    async fetchData(url) {

        if(this.cachedData){
            console.log('data cached');
            return this.cachedData;
        }
        
        const response = await fetch(url);

        if(!response.ok){
            throw new Error (`Erreur HTTP: ${response.status}`);
        }

        this.cachedData = await response.json();

        console.log('data server');
        
        return this.cachedData;

    }


};



// ( async () => {

//     try{

//         const data = await getData.fetchData('../data.json');
//         console.log(data);
//         feedIndexPage(data);

//     } catch(error) {

//         console.error('Error download data :', error.message);
//         // document.body.innerHTML += "<p>Erreur de chargement</p>";
//     }

// })()



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




/* FETCH + DISPLAY TEXT PAGE */

// const balance = document.querySelector('.expenses:nth-of-type(1) .amount');
// const income = document.querySelector('.expenses:nth-of-type(2) .amount');
// const expense = document.querySelector('.expenses:nth-of-type(3) .amount');


// const potsTotalSaved = document.querySelector('.total-saved .text');


// const potsSavings = document.querySelector('.section-pots li-pots:nth-of-type(1) span');
// const potsGifts = document.querySelector('.section-pots li-pots:nth-of-type(2) span');
// const potsTickets = document.querySelector('.section-pots li-pots:nth-of-type(3) span');
// const potsLaptop = document.querySelector('.section-pots li-pots:nth-of-type(4) span');






