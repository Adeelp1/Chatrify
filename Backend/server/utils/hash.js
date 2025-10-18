'use strict';

const { hash, compare} = require('bcrypt');

async function hashPassword(password) {
    return await hash(password, 10);
}

async function comparePassword(pass1, pass2) {
    return await compare(pass1, pass2);
}

module.exports =  {hashPassword, comparePassword}