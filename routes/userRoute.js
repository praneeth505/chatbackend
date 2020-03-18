const express = require('express');
var router = express.Router();
var user = require('../controller/user');

router.post('/saveuser', user.saveUserData)
router.put('/loginflag', user.updateLoginFlag)
router.get('/onlineusers', user.getOnlineUsers)
module.exports = router; 