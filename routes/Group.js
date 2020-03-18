const express = require('express');
var router = express.Router();
var groupController = require('../controller/GroupController')

router.post("/group", groupController.addGroup)
router.get("/getgroup", groupController.getGroups)
router.post("/getmessage", groupController.getMessage)
router.post("/getmessageoffset", groupController.getMessageOffset)

module.exports = router;


