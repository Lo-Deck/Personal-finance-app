# Frontend Mentor - Personal finance app solution

This is a solution to the [Personal finance app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/personal-finance-app-JfjtZgyMt1). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)


## Overview

### The challenge

Users should be able to:

- See all of the personal finance app data at-a-glance on the overview page
- View all transactions on the transactions page with pagination for every ten transactions
- Search, sort, and filter transactions
- Create, read, update, delete (CRUD) budgets and saving pots
- View the latest three transactions for each budget category created
- View progress towards each pot
- Add money to and withdraw money from pots
- View recurring bills and the status of each for the current month
- Search and sort recurring bills
- Receive validation messages if required form fields aren't completed
- Navigate the whole app and perform all actions using only their keyboard
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page
- **Bonus**: Save details to a database (build the project as a full-stack app)
- **Bonus**: Create an account and log in (add user authentication to the full-stack app)


### Screenshot

![screenshot mobile-Overview](https://github.com/Lo-Deck/Personal-finance-app/blob/main/frontend/screenshot/Personal%20finance%20app%20-%20mobile%20-%20Overview.png).
![screenshot mobile-Recurring](https://github.com/Lo-Deck/Personal-finance-app/blob/main/frontend/screenshot/Personal%20finance%20app%20-%20mobile%20-%20Recurring.png).
![screenshot tablet - Overview](https://github.com/Lo-Deck/Personal-finance-app/blob/main/frontend/screenshot/Personal%20finance%20app%20-%20tablet%20-%20Overview.png).
![screenshot tablet - Pots](https://github.com/Lo-Deck/Personal-finance-app/blob/main/frontend/screenshot/Personal%20finance%20app%20-%20tablet%20-%20Pots.png).
![screenshot tablet - Transactions](https://github.com/Lo-Deck/Personal-finance-app/blob/main/frontend/screenshot/Personal%20finance%20app%20-%20tablet%20-%20Transactions.png).
![screenshot desktop-Overview](https://github.com/Lo-Deck/Personal-finance-app/blob/main/frontend/screenshot/Personal%20finance%20app%20-%20desktop%20-%20Overview.png).
![screenshot desktop-budgets](https://github.com/Lo-Deck/Personal-finance-app/blob/main/frontend/screenshot/Personal%20finance%20app%20-%20desktop%20-%20Budget.png).


### Links

- Solution URL: [Repositories](https://github.com/Lo-Deck/Personal-finance-app).
- Live Site URL: [Website]().


## My process

### Built with

- Semantic HTML5 markup
- Nested CSS
- Flexbox
- CSS Grid
- Mobile-first workflow



### What I learned


Leveraged modern HTML5 tags `<template>` and `<dialog>`, to build a high-performance transaction management system, streamlining DOM manipulation while ensuring native accessibility.


```html

  <template id="template-transaction">
    <div class="transactions" role="row">
      <div class="container-avatar">
        <img src="" alt="avatar" class="avatar">
      </div>
      <div class="cell-name" role="cell">  
        <p class="text public-sans-bold text-preset-4"></p>
      </div>
      <div class="cell-category" role="cell">
        <p class="text public-sans-regular text-preset-5"></p>
      </div>
      <div class="cell-amount" role="cell">
        <p class="text public-sans-bold text-preset-4 plus"></p>
      </div>
      <div class="cell-date" role="cell">
        <time datetime="2024-08-19" class="text public-sans-regular text-preset-5"></time>
      </div>
    </div>    
  </template>

```


```html

  <dialog class="modal modal-delete">
    <div class="container-title">
      <h3 class="title public-sans-bold text-preset-1 text-preset-2"></h3>
      <form method="dialog">
        <button type="submit" class="button close-modal"><img src="../assets/images/icon-close-modal.svg" alt=""></button>   
      </form>
    </div>
    <p class="text public-sans-regular text-preset-4"></p>
    <form id="deletePot" action="" class="search-field">
      <div class="container-modal-button public-sans-bold text-preset-4">
        <button type="submit" class="button button-submit-modal">Yes, Confirm Deletion</button>
      </div>
    </form>
    <form method="dialog" class="search-field">
      <div class="container-modal-button public-sans-regular text-preset-4">
        <button type="submit" class="button button-submit-modal">No, Go Back</button>
      </div>
    </form>
  </dialog>

```


Implemented modern CSS nesting to maintain a clean and hierarchical stylesheet, significantly improving code readability and maintainability without the need for preprocessors.
Utilized fluid typography and spacing via the CSS clamp() function, combined with native nesting, to create a highly adaptive website.

```css
  .li-menu{
    width: clamp(4.2875rem, 2.1763rem + 9.0076vw, 6.5rem);
    height: clamp(2.75rem, 1.438rem + 5.598vw, 4.125rem);
    a{
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    svg{
      width: 1.25rem;
      height: 1.25rem;
      fill: #b3b3b3;
    }
    span{
      display: none;
      color: var(--grey-300);
    }
    &.selected{
      background: var(--beige-100);
      border-bottom: var(--space-04px) solid var(--secondary-green);
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
      span{
        color: var(--grey-900);
      }
      svg{
        fill: var(--secondary-green);
      }
    }
    &:hover:not(.selected){
      svg{
        fill: var(--grey-100);
      }
      span{
        color: var(--grey-100);
      }
    }
  }

```


Optimized application startup by leveraging parallel data fetching with Promise.all(), reducing overall loading time. Implemented a robust asynchronous initialization pattern with centralized error handling to ensure a resilient user experience.

```js

    ( async () => {

        try{

            setupSideMenu()
            
            const [ balance, pots ] = await Promise.all ([
                getData.fetchData('http://localhost:3000/balance'),
                getData.fetchData('http://localhost:3000/pots')
            ]);

            data = {
                balance: balance,
                pots: pots
            };

            listHTMLColorTag.forEach( (li) => {
                colorTagsMap[li.dataset.sort] = li;
            });

            feedPotsPage(data.pots);

        } catch(error) {
            console.error('CRITICAL APP ERROR:', error.message);
            console.error('CRITICAL APP ERROR:', error.stack);
            document.querySelector('.container-main').innerHTML = `
                <div class="error-message">
                    <p style="font-size: 2rem; margin-top: 5rem; color: red;"> !!! Impossible to download data !!! </p>
                    <button onclick="location.reload()" style="font-size: 2rem; margin-top: 1rem; padding: 0.5rem; border: 2px solid red; color: red;">Retry</button>
                </div>`; 
        }

    })()

```


Optimized DOM rendering by utilizing DocumentFragments and HTML Templates. Instead of triggering multiple reflows, all clones are processed in memory and injected in a single batch, significantly enhancing UI performance.

```js

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

```


Implemented a centralized event delegation strategy by attaching a single event listener to the document. This approach optimizes memory usage and performance by eliminating the need for multiple individual listeners, especially for dynamically rendered elements.

```js

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
        modalAdd.queryS ......
```


### Continued development

Learning from each challenge, I will continue to make website with JS and learning from different challenge from Front-end Mentor.


### Useful resources

- [Mozilla mdn](https://developer.mozilla.org/) - Very useful.
- [FreeCodeCamp](https://www.freecodecamp.org/) - I've been learning a lot.
- [Utopia](https://utopia.fyi/) - To have a better responsive design.


## Author

- Frontend Mentor - [@Lo-deck](https://www.frontendmentor.io/profile/Lo-Deck)


## Acknowledgments

Thanks to Front-end Mentor and its community.
