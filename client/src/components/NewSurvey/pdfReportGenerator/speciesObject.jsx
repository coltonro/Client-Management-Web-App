import { fullSpeciesList } from "../../../fullSpeciesList";

const SpeciesObject = (birdsInfo) => {

    const speciesCounterObject = {};
    const speciesIdArray = [];
    const sortedSpeciesObject = {};

    birdsInfo.map((observation, i) => {
        const commonName = observation.CommonName;
        const count = observation.Number;
        // sum how many of each bird
        speciesCounterObject[commonName] ?
            speciesCounterObject[commonName] = speciesCounterObject[commonName] + count : speciesCounterObject[commonName] = count;
    });

    for (let key in speciesCounterObject) {
        // track bird ids so they can be sorted taxonomically later
        for (let i = 0; i < fullSpeciesList.length; i++) {
            if (fullSpeciesList[i].CommonName == key) {
                speciesIdArray.push(fullSpeciesList[i].BirdId);
                break;
            }
        }
    }

    // sort birds by id so they can be listed in order/taxonomically
    speciesIdArray.sort((a, b) => a - b);

    // insert data into sortedSpeciesObject so that all birds are in taxonomic order (really ordering by id, but same thing in this case)
    for (let i = 0; i < speciesIdArray.length; i++) {
        const id = speciesIdArray[i];
        for (let i = 0; i < fullSpeciesList.length; i++) {
            if (fullSpeciesList[i].BirdId === id) {
                sortedSpeciesObject[fullSpeciesList[i].CommonName] = speciesCounterObject[fullSpeciesList[i].CommonName]
            }
        }
    }

    return sortedSpeciesObject;
}

export default SpeciesObject