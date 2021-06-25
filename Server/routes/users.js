const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
require('../config/passport')(passport);
const db = require('../models');
const User = db.users;
const Review = db.reviews;

// Sign up a new user, hashing the p/w, creating the user record
router.post('/signup', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).send('Please provide username and password');
    } else {
        try {
            const user = await User
                .create({
                    username: req.body.username,
                    password: req.body.password,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                });

            res.status(201);
        } catch (e) {
            res.status(400).send(e.message || 'Unable to create user');
        }
    }
});

// Get the reviews for a given user id
router.get('/:userId/reviews', passport.authenticate('jwt', {session: false}), async(req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        res.status(400).send('No user id provided');
    } else {
        try {
            const reviews = await Review.findAll({
                where: {
                    userId: userId
                }
            });

            if (reviews && reviews.length > 0) {
                res.status(200).send(reviews);
            } else {
                res.status(204).send(`No reviews found for user id ${userId}`);
            }
        } catch (e) {
            res.status(500).send(e.message || `Unable to get reviews for user id ${userId}`);
        }
    }
});

// Get the currently logged in user - useful for showing initials, etc
router.get('/me', passport.authenticate('jwt', {session: false}), async(req, res) => {
    const userId = req?.user?.dataValues?.id;

    if (!userId) {
        res.status(401).send('You are not logged in');
    } else {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                res.status(500).send('Unable to find user with that id, sorry');
            } else {
                // Great, we got a user, return to user, but *without* the password hash - unsafe
                res.status(200).send({
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName
                });
            }
        } catch (e) {
            res.status(500).send(e.message || 'Unable to find user with that id, sorry');
        }
    }
});

// Leave a new review, for the userid in the route
router.post('/:userId/review', passport.authenticate('jwt', {session: false}), async(req, res) => {
    const userId = req.params.userId;
    const review = req.body;
    const reviewerId = req?.user?.dataValues?.id;

    try {

        if (userId && reviewerId && review && review.content && review.rating) {
            const created = await Review.create({
                content: review.content,
                rating: review.rating,
                userId: userId, // Person the review is for
                reviewingUserId: reviewerId // Person who's leaving the review
            });

            if (created) {
                res.send(created);
            } else {
                res.status(500).send(`Unable to post review for user id ${userId}`);
            }
        } else {
            res.status(400).send(`Unable to post review for ID ${userId}`);
        }
    } catch (e) {
        res.status(500).send(e.message || `Unable to create review for user id ${id}`);
    }
});

// Sign a user in, get a token
router.post('/signin', async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username
            }
        });

        if (!user) {
            return res.status(401).send({
                message: 'Authentication failed. User not found.',
            });
        }

        // Compare the password, return a token if successful, or return 401 if unsuccessful
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(isMatch && !err) {
                // TODO: move expiresIn to config, so it can be easily changed, current 30 days (86400 seconds in 1 day)
                const token = jwt.sign(JSON.parse(JSON.stringify(user)), 'nodeauthsecret', {expiresIn: 86400 * 30});
                jwt.verify(token, 'nodeauthsecret', (err, data) => {
                    console.log(err, data);
                });
                res.json({success: true, token: 'JWT ' + token});
            } else {
                res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
            }
        })
    } catch (e) {
        res.status(400).send(e.message);
    }
});

module.exports = router;