const express = require('express');
var router = express.Router();
var Data = require('../controller/Data')

console.log('usermessrouter')
router.post('/getmessagesoffset', Data.userMessagesOffset)
router.post('/getmessages', Data.userMessages)
router.put('/update', Data.updateLikeFlag)
router.put('/updatedislike', Data.dislikeFlag)
router.post('/updatetick', Data.updateTickFlag)
router.post('/imageupload', Data.imageUpload)

module.exports = router; 