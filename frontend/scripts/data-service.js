

// export const getData = {

//     cachedData : null,

//     async fetchData(url) {

//         if(this.cachedData){
//             // console.log('data retrieved from cache');
//             return this.cachedData;
//         }
        
//         const response = await fetch(url);

//         if(!response.ok){
//             throw new Error (`Erreur HTTP: ${response.status}`);
//         }

//         this.cachedData = await response.json();

//         return this.cachedData;

//     }

// };



// export const getData = {
//     async fetchData(url) {
//         // 1. Essayer de récupérer dans le localStorage
//         const local = localStorage.getItem('app_data_' + url);
//         if (local) return JSON.parse(local);

//         // 2. Sinon, fetch
//         const response = await fetch(url);
//         if (!response.ok) throw new Error(`Erreur: ${response.status}`);
        
//         const data = await response.json();
        
//         // 3. Sauvegarder dans le localStorage pour le prochain rechargement
//         localStorage.setItem('app_data_' + url, JSON.stringify(data));
        
//         return data;
//     },

//     // Appelle ça dans ton pots.js après un PATCH réussi
//     clearCache() {
//         localStorage.clear(); // Ou localStorage.removeItem('app_data_...');
//     }
// };




// export const getData = {
//     async fetchData(url) {
//         const response = await fetch(url);
//         if(!response.ok) {
//             throw new Error(`Erreur HTTP: ${response.status}`);
//         }
//         return await response.json(); 
//     }
// };



export const getData = {
    async fetchData(url) {
        const response = await fetch(url);
        if (!response.ok) {
            const data = await response.json();
            // throw new Error(data.error);
            throw new Error(`Error HTTP: ${response.status}: ${response.statusText}, ${data.error}`);
        }
        return await response.json();
    }
};


// export const getData = {
//     async fetchData(url) {
//         const response = await fetch(url);
//         if (!response.ok) {
//             // let errorMessage = 'An unknown error occurred';
//             try {
//                 const data = await response.json();
//                 // console.log('data error', data);
//                 errorMessage = data.error || responseStatus;
//             } catch (e) {
//                 errorMessage = `Error HTTP:${response.status}: ${errorMessage}`;
//             }
//             throw new Error(errorMessage);
//             // throw new Error(`Error HTTP:${response.status}: ${response.statusText}`);
//         }
//         return await response.json();
//     }
// };





/**
 * Send data to the server,
 * @param {string} url - address to send the data.
 * @param {Object|null} dataToInsert - data to send or null for DELETE.
 * @param {string} method - POST, PATCH, DELETE.
 * @returns {Promise<Object>} - The response data from the server.
 */


export async function sendData(url, dataToInsert, method){

    try{

        // console.log("1. Entrée dans sendData");
        const config = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        }

        if(method !== 'DELETE' && dataToInsert !== null){
            config.body = JSON.stringify(dataToInsert);
        }


        const response = await fetch(url, config);
        // console.log("2. Réponse reçue, status:", response.status);

        console.log('response', response);

        // console.log('response text', response.text());

        const data = await response.json();

        console.log('data fetch', data);
        
        
        if(!response.ok){
            // const data = await response.json();
            throw new Error(`Erreur Serveur: ${response.status} ${response.statusText}, ${data.error}`);
        }

    /***********************************************/
    /********** A CONTROLER LORS DUN DELETE ************/
    /***********************************************/
        // if (response.status === 204 || method === 'DELETE') { A VOIR SI FONCTIONNEL
        //     return { success: true }; 
        // }
        // const data = await response.json();


        return data;

    } catch(error){
        console.error('Error sending data :', error.message);
        throw error;
    } 


}


