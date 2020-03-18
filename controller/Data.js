var conn = require('../config/config');
var multer  = require('multer')
// var upload = multer({ dest: 'uploads/' })

userMessages = (req, res) => {

    let sender = req.body.sender;
    let receiver = req.body.receiver;
    console.log("getting messages")
    console.log(sender, receiver)

    // console.log("params", req.query.id)
    // if(sender){
        // conn.pool.query("UPDATE user_data SET tickflag = $1 WHERE ")
    conn.pool.query("select timestamp, sender, receiver, message, likeflag, tickflag from user_data where sender = $1 and receiver = $2 or sender=$2 and receiver=$1 order by timestamp asc", [sender, receiver],
     (err, response) => {
         if(err){
             console.log(err)
         }
         if(response){
             console.log("getting res")
            res.send(response)
         }
     })
}

userMessagesOffset = (req, res) => {

    let sender = req.body.sender;
    let receiver = req.body.receiver;
    // let limit = req.query.limit;
    // let offset = req.query.offset;

    console.log("offset limit")
    console.log(sender, receiver)

    conn.pool.query("select timestamp, sender, receiver, message, likeflag, tickflag, images, messageflag from user_data where sender = $1 and receiver = $2 or sender=$2 and receiver=$1 order by timestamp asc ", [sender, receiver],
     (err, response) => {
         if(err){
             console.log(err)
         }
         if(response){
             console.log("getting res")
            res.send(response)
         }
     })
}

updateLikeFlag =  (req, res) => {
    let timestamp = req.body.timestamp;
    // let receiver = req.body.receiver;
    // debugger
    console.log("like flag")
    conn.pool.query("update user_data set likeflag = $1 where timestamp = $2 ", [true, timestamp], 
    (err, response) => {
        if(err)
            console.log(err)
        if(response)
            res.send(response)
    })
}

dislikeFlag = (req, res) => {
    let timestamp = req.body.timestamp;

    console.log("unlike flag");
    conn.pool.query("update user_data set likeflag = $1 where timestamp = $2 ", [false, timestamp], 
    (err, response) => {
        if(err)
            res.send(err)
        if(response)
            res.send(response)
    })
}

updateTickFlag = (req, res) => {

    console.log(req.body)
    let sender = req.body.sender;
    let receiver = req.body.receiver;
    console.log("update")
    // console.log("offset limit")
    // console.log(sender, receiver)

    conn.pool.query("update user_data set tickflag = $1 where sender = $2 and receiver = $3", [true, sender, receiver],
     (err, response) => {
         if(err){
             console.log(err)
         }
         if(response){
             console.log("getting res")
            res.send(response)
         }
     })
}

imageUpload = (req, res) => {
    console.log("imageupload");

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, '/images/my-uploads')
        },
        filename: function (req, file, cb) {
          cb(null, file.fieldname + '-' + Date.now())
        }
      })

      var upload = multer({ storage: storage })
}

module.exports = { userMessages, updateLikeFlag, dislikeFlag, userMessagesOffset, updateTickFlag, imageUpload }