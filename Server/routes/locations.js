const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport')(passport);
const locations = require('../services/location');

// Search for an address (lng, lat, etc) by place name (searchText in the query string)
router.get('/search', passport.authenticate('jwt', {session: false}), async (req, res) => {
    const searchText = req?.query?.searchText;

    if (!searchText || searchText.length === 0) {
        res.status(204).send(`Unable to find any places for an empty search string`);
    }

    try {
        const places = await locations.findPlaceFromText(searchText);
        res.send(places?.candidates);
    } catch (e) {
        console.log(e);
        res.status(500).send(e.message || `Unable to get places for search string ${searchText}`);
    }
});

module.exports = router;