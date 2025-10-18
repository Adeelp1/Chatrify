'use strict';
// const sqlite3 = require("sqlite3");
// const path = require("path");
const userAcc = require("../models/user_account_model");
const matchMaking = require("../models/user_matchmaking_model")
const userProfile = require("../models/user_profile_model");

// const dbFiles = 'chatrify.db';

// function for test db
async function testDb() {
    try {
        // user account model sample query 
        let createUser = await userAcc.createUser("adeel", "adeel@add", "passHash"); console.log("done");
        let updatePass = await userAcc.updatePassword(1, "newPass");console.log("done");
        let updateUsername = await userAcc.updateUsername(1, "khalid");console.log("done");
        let updateEmail = await userAcc.updateEmail(1, "adeel1@add");console.log("done");
        let searchByUsername = await userAcc.searchByUsername("adeel");console.log("done");
        let searchByUsername1 = await userAcc.searchByUsername("khalid");console.log("done");
        let searchByEmail = await userAcc.searchByEmail("adeel1@add");console.log("done");
        let getPasswordByEmail = await userAcc.getPasswordByEmail("adeel1@add");console.log("done");
        let getPasswordByUsername = await userAcc.getPasswordByUsername("khalid");console.log("done");

        // user profile model sample query
        let createUserProfile = await userProfile.createUserProfile(1, "kahlid", "adeel", "adeelp", "M", "IN", "sports, movies", "aa");console.log("done");
        let updateFirstname = await userProfile.updateFirstname(1, "KHALID");console.log("done");
        let updateLastname = await userProfile.updateLastname(1, "ADEEL");console.log("done");
        let updateNickname = await userProfile.updateNickname(1, "NICKNAME");console.log("done");
        let updateGenderP = await userProfile.updateGender(1, "MALE");console.log("done");
        let updateCountryP = await userProfile.updateCountry(1, "USA");console.log("done");
        let updateBio = await userProfile.updateBio(1, "eeeeeeeeee");console.log("done");
        let updateInterestsP = await userProfile.updateInterests(1, "football");console.log("done");
        let searchByUseridP = await userProfile.searchByUserid(1, "football");console.log("done");

        // user match making model sample query
        // let createMatchmaking = await matchMaking.createMatchmaking(1, "india", "Male", "sports, music, games");
        let updateCountry = await matchMaking.updateCountry(1, "USA");console.log("done");
        let updateGender = await matchMaking.updateGender(1, "OtHERs");console.log("done");
        let updateInterests = await matchMaking.updateInterests(1, "movies");console.log("done");
        let searchByUserid = await matchMaking.searchByUserid(1);console.log("done");
        let getMatchmakingDetails = await matchMaking.getMatchmakingDetails(1);console.log("done");
        // let _getInterests = await matchMaking._getInterests(1);

        let allData = await userAcc.getAllData();
        console.log(allData);
        allData = await userProfile.getAllData();
        console.log(allData);
        allData = await matchMaking.getAllData();
        console.log(allData);
        
    } catch (error) {
        console.error(error + "[ from test_db ]");
    }
}

testDb();