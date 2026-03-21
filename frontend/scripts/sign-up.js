
import { sendData } from './data-service.js';
import { validateInput, showPassword } from './ui-utils.js';


showPassword();


const formSignUp = document.querySelector('#sign-up');

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
        console.log('INVALID FORM SIGN-UP');
        return;
    }

    console.log('VALID FORM SIGN-UP');

    const formData = new FormData(form);
    const newUserData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    };


    try{
        const newUser = await sendData(`/users/sign-up`, newUserData, 'POST');
        console.log('Sign-up newUser: ', newUser);
        if(newUser){
            window.location.href = '/pages/sign-in.html';
        }

    } catch(error){
        console.error('Error sending data :', error.message);
        alert(`Impossible to create new user : ${error.message}`);
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

