

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


// const CacheManager = {
//     // Récupérer une donnée (soit du cache, soit du serveur)
//     async getOrFetch(key, url) {
//         const cachedData = sessionStorage.getItem(key);

//         if (cachedData) {
//             console.log(`[Cache] Chargement de ${key} depuis le stockage local`);
//             return JSON.parse(cachedData);
//         }

//         console.log(`[Server] Récupération de ${key} depuis le serveur...`);
//         const response = await fetch(url);
//         const data = await response.json();

//         // On enregistre dans le cache pour la prochaine fois
//         sessionStorage.setItem(key, JSON.stringify(data));
//         return data;
//     },

//     // Vider une clé spécifique (à appeler après un POST, PUT ou DELETE)
//     clear(key) {
//         sessionStorage.removeItem(key);
//     },

//     // Tout vider (utile lors du Logout)
//     clearAll() {
//         sessionStorage.clear();
//     }
// };




export const getData = {
    async fetchData(url) {
        const response = await fetch(url);
        if (!response.ok) {
            const data = await response.json();
            throw new Error(`Error HTTP: ${response.status}: ${response.statusText}, ${data.error}`);
        }
        return await response.json();
    }
};





/**
 * Send data to the server,
 * @param {string} url - address to send the data.
 * @param {Object|null} dataToInsert - data to send or null for DELETE.
 * @param {string} method - POST, PATCH, DELETE.
 * @returns {Promise<Object>} - The response data from the server.
 */


export async function sendData(url, dataToInsert, method){

    try{

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

        const data = await response.json();

        if(!response.ok){
            throw new Error(`Erreur Serveur: ${response.status} ${response.statusText}, ${data.error}`);
        }

        return data;

    } catch(error){
        console.error('Error sending data :', error.message);
        throw error;
    } 


}


