'use strict';

const express = require('express');
const router = express.Router();

const { matchUser } = require('../controllers/matchMaking.controller')


router.post("/match", matchUser);

module.exports = router;