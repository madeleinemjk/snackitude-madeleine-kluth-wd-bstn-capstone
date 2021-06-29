const {PlaceInputType} = require("@googlemaps/google-maps-services-js");
const {Client} = require("@googlemaps/google-maps-services-js");
const client = new Client({});
require('dotenv').config();
const API_KEY = process.env.GOOGLE_API_KEY;

// Find places from a string input (e.g. 47 Station Road, SG18 9PG)
const findPlaceFromText = async (input) => {
    const places = await client.findPlaceFromText({
        params: {
            key: API_KEY,
            input: input,
            inputtype: PlaceInputType.textQuery,
            fields: ['formatted_address', 'name', 'geometry', 'place_id']
        }
    });

    return places?.data;
};

module.exports = {
    findPlaceFromText: (input) => findPlaceFromText(input)
};