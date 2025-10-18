'use strict';

const db = require('../db');
const { initUser } = require('./user_account_model');
const { initUserMatchMacking } = require('./user_matchmaking_model');
const { initUserSession } = require('./user_session_model');
const { initUserProfile } = require('./user_profile_model');

function initDB() {
    db.serialize(() => {
        initUser(),
        initUserMatchMacking(),
        initUserSession(),
        initUserProfile()
    });
}

module.exports = initDB;