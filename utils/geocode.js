const axios = require("axios");

async function getCoordinates(location) {

    const url =
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;

    const response = await axios.get(url, {

        headers:{
            "User-Agent":"StayFinder"
        }

    });

    if(response.data.length===0){
        throw new Error("Location not found");
    }

    return {

        lat: parseFloat(response.data[0].lat),
        lon: parseFloat(response.data[0].lon)

    };

}

module.exports = getCoordinates;