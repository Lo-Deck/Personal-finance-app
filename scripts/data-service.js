

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

        // console.log('data server');

        return this.cachedData;

    }

};

