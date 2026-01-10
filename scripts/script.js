



const containerHeader = document.querySelector('.container-header');
const btnExtendMenu = document.querySelector('.button-extend-menu');



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




