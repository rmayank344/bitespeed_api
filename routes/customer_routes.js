const express = require('express');
const router = new express.Router();

const {identifyUser} = require('../controller/customer_order');

//routes
router.post('/identify', identifyUser);

module.exports = router;