const express = require('express');
const router = express.Router();
const db = require('../models');
const SnackRequests = db.snackRequests;
const Messages = db.messages;
const User = db.users;
const passport = require('passport');
require('../config/passport')(passport);
const {Client} = require("@googlemaps/google-maps-services-js");
const client = new Client({});
const API_KEY = 'AIzaSyB5CRZSBEIoMAK5UmI2b1S6gWg1octs3vg';

// Get all snack requests
router.get('/delivering', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const userId = req?.user?.dataValues?.id;
        const snackRequests = await SnackRequests.findAll({
            where: {
                deliveringUserId: userId
            }
        });

        if (snackRequests?.length > 0) {
            res.send(snackRequests);
        } else {
            res.status(204).send('No snack requests found');
        }
    } catch (e) {
        res.status(500).send(e.message || `Unable to get snack requests`);
    }
});

router.get('/requesting', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const userId = req?.user?.dataValues?.id;
        const snackRequests = await SnackRequests.findAll({
            where: {
                requestingUserId: userId
            }
        });

        if (snackRequests?.length > 0) {
            res.send(snackRequests);
        } else {
            res.status(204).send('No snack requests found');
        }
    } catch (e) {
        res.status(500).send(e.message || `Unable to get snack requests`);
    }
});

// Search for snack requests within a given radius of the provided lng and lat
router.get('/search', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const lng = req.query.lng;
        const lat = req.query.lat;
        const radius = req.query.radius;

        // Get all snack requests currently not accepted
        const allRequests = (await SnackRequests.findAll())
            ?.map(request => request?.dataValues)
            ?.filter(snackRequest => !snackRequest.deliveringUserId);

        if (allRequests?.length > 0) {
            const params = {
                params: {
                    key: API_KEY,
                    origins: [{
                        lat: parseFloat(lat),
                        lng: parseFloat(lng)
                    }],
                    destinations: allRequests?.map(request => {
                        return {
                            lat: parseFloat(request?.latitude),
                            lng: parseFloat(request?.longitude)
                        }
                    })
                }
            };

            const distances = await client.distancematrix(
                params
            );

            const results = [].concat(distances?.data?.rows?.map(row => row?.elements))[0];

            allRequests.forEach((request, index) => {
                request.distance = results[index]?.distance?.value;
                request.duration = results[index]?.duration?.value; // This is in seconds
            });

            const allRequestsInRange = allRequests.filter(result => {
                return (result.distance) < radius * 1000; // Search radius (in KM) within result distance in KM
            });

            if (results?.length > 0) {
                res.send(allRequestsInRange);
            } else {
                res.status(204).send('No snack requests found');
            }
        } else {
            res.status(204).send('No snack requests found');
        }
    } catch (e) {
        res.status(500).send(e.message || `Unable to get snack request for id ${id}`);
    }
});

// Accept the snack request with the provided id
router.put('/:snackRequestId/accept', passport.authenticate('jwt', {session: false}), async (req, res) => {
    const snackRequestId = req.params.snackRequestId;
    const userId = req?.user?.dataValues?.id;

    const acceptSnackRequestModel = req.body;

    const snackRequest = await SnackRequests.findByPk(snackRequestId);

    const updated = await snackRequest.update({
        deliveringUserId: userId,
        fromLongitude: acceptSnackRequestModel.longitude,
        fromLatitude: acceptSnackRequestModel.latitude,
        fromPlaceId: acceptSnackRequestModel.placeId,
        fromAddressName: acceptSnackRequestModel.addressName,
        distance: acceptSnackRequestModel.distance,
        duration: acceptSnackRequestModel.duration
    });

    res.send(updated);
});

// Add a new message to a given snack request id
router.post('/:snackRequestId/message', passport.authenticate('jwt', {session: false}), async (req, res) => {
    const id = req.params.snackRequestId;
    const message = req.body;
    const userId = req?.user?.dataValues?.id;

    try {
        if (id && message && message.message && userId) {
            const created = await Messages.create({
                message: message.message,
                timestamp: new Date(), // Use current date + time here
                snackRequestId: id,
                sendingUserId: userId
            });

            req.io.sockets.emit('Update', {snackRequestId: id});
            res.status(201).send(created);
        } else {
            res.status(400).send(`Unable to parse request for new message for new user ID: ${userId} on snackRequestID: ${id}`);
        }
    } catch (e) {
        res.status(500).send(e.message || `Unable to create message for user id ${id}`);
    }
});

// Create a new snack request
router.post('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    const snackRequest = req.body;
    const userId = req?.user?.dataValues?.id;

    try {
        if (snackRequest.description && snackRequest.longitude && snackRequest.latitude && snackRequest.maxWaitTime && snackRequest.budget) {
            const created = await SnackRequests.create({
                description: snackRequest.description,
                longitude: snackRequest.longitude,
                latitude: snackRequest.latitude,
                maxWaitTime: snackRequest.maxWaitTime,
                budget: snackRequest.budget,
                addressName: snackRequest.addressName,
                placeId: snackRequest.placeId,
                requestingUserId: userId
            });

            res.send(created);
        } else {
            res.status(400).send('Unable to create snack request - columns missing');
        }
    } catch (e) {
        res.status(500).send(e.message || `Unable to create new snack request`);
    }
});

// Get a single snack request by id, including messages
router.get('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const id = req.params.id;
        const snackRequest = await SnackRequests.findByPk(id, {
            include: [
                {
                    model: Messages,
                    as: 'messages',
                    include: [
                        {
                            model: User,
                            as: 'sendingUser'
                        }
                    ]
                },
                {
                    model: User,
                    as: 'deliveringUser'
                },
                {
                    model: User,
                    as: 'requestingUser'
                }
            ]
        });

        if (snackRequest) {
            res.send(snackRequest);
        } else {
            res.status(204).send(`No snack request found for id ${id}`);
        }
    } catch (e) {
        res.status(500).send(e.message || `Unable to get snack request for id ${id}`);
    }
});

module.exports = router;