const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

// Load up the user module from sequelize
const db = require('../models');
const User = db.users;

// Configure up passportJS for JWT strategy
module.exports = function(passport) {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
        secretOrKey: 'nodeauthsecret', // TODO: Change this, move to ENV variable or config
    };
    passport.use('jwt', new JwtStrategy(opts, function(jwt_payload, done) {
        User
            .findByPk(jwt_payload.id)
            .then((user) => { return done(null, user); })
            .catch((error) => { return done(error, false); });
    }));
};