

export const getData = {

    cachedData : null,

    async fetchData(url) {

        if(this.cachedData){
            // console.log('data retrieved from cache');
            return this.cachedData;
        }
        
        const response = await fetch(url);

        if(!response.ok){
            throw new Error (`Erreur HTTP: ${response.status}`);
        }

        this.cachedData = await response.json();

        return this.cachedData;

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

        // const response = await fetch(url, {
        //     method: method,
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(dataToInsert)
        // });

        const response = await fetch(url, config);
        // console.log("2. Réponse reçue, status:", response.status);

        if(!response.ok){
            throw new Error(`Erreur Serveur: ${response.status} ${response.statusText}`);
        }


    /***********************************************/
    /********** A CONTROLER LORS DUN DELETE ************/
    /***********************************************/

        // if (response.status === 204 || method === 'DELETE') { A VOIR SI FONCTIONNEL
        //     return { success: true }; 
        // }

        const data = await response.json();

        // console.log('3. Update successful:', data);

        return data;

    } catch(error){
        console.error('Error sending data :', error.message);
        throw error;
    } 


}


