
import { sendData } from './data-service.js';
import { validateInput, showPassword } from './ui-utils.js';

showPassword();

const formSignUp = document.querySelector('#sign-in');

formSignUp.addEventListener('submit', async (event) => {

    event.preventDefault();

    const form = event.target;
    const label = form.querySelectorAll('label');
    const inputs = form.querySelectorAll('input');

    // console.log(inputs);
    
    const results = Array.from(inputs).map( (input, index) => {
        return validateInput(input, label[index]);
    });

    const isValid = results.every(res => res === true);
    if(!isValid){
        // console.log('INVALID FORM SIGN-IN');
        return;
    }

    // console.log('VALID FORM SIGN-IN');

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




/****INPUT****/

const labels = document.querySelectorAll('label');

labels.forEach( (label) =>  {
    const input = label.querySelector('input');
    input.addEventListener('input', () => {
        label.classList.remove('error');
    });
});
