




// import { getData } from './data-service.js';



// ( async () => {

//     try{




//     } catch(error) {

//         console.error('CRITICAL APP ERROR:', error.message);
//         console.error('CRITICAL APP ERROR:', error.stack);
//         document.querySelector('.container-main').innerHTML = `
//             <div class="error-message">
//                 <p style="font-size: 2rem; margin-top: 5rem; color: red;"> !!! Impossible to download data !!! </p>
//                 <button onclick="location.reload()" style="font-size: 2rem; margin-top: 1rem; padding: 0.5rem; border: 2px solid red; color: red;">Retry</button>
//             </div>`; 

//     }

// })()





import { sendData } from './data-service.js';
import { validateInput } from './ui-utils.js';



const formSignUp = document.querySelector('#sign-in');


formSignUp.addEventListener('submit', async (event) => {


    event.preventDefault();

    const form = event.target;

    const label = form.querySelectorAll('label');

    const inputs = form.querySelectorAll('input');

    const results = Array.from(inputs).map( (input, index) => {
        return validateInput(input, label[index]);
    });



    const isValid = results.every(res => res === true);

    if(!isValid){
        console.log('INVALID FORM SIGN-IN');
        return;
    }

    console.log('VALID FORM SIGN-IN');

    const formData = new FormData(form);

    const userData = {

        email: formData.get('email'),
        password: formData.get('password'),

    };


    try{

        const loginUser = await sendData(`/users/sign-in`, userData, 'POST');
        console.log('Sign-up loginUser: ', loginUser);

        if(loginUser){
            window.location.href = '/';
        }
        
    } catch(error){
        console.error('Error sending data :', error.message);
        alert(`Impossible to login : ${error.message}`);
    }


})