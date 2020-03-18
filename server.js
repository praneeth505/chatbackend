var express = require('express');
var app = express();
var router = express.Router();
var server = require('http').createServer(app);
var cors = require('cors');
var bodyparser = require('body-parser')
var socket = require('socket.io');
var io = socket.listen(server);
var conn = require('./config/config');
var group = require('./routes/Group');
var multer  = require('multer');
var path = require('path')
app.use(cors())
app.use(express.static(__dirname+'/images'));

var storage = multer.diskStorage({
    destination: './images/myuploads',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
  })

var upload = multer({ storage: storage, limits:{fileSize: 1000000} }).single('myImage')

// app.post('/upload',upload.single('myImage'),(req, res) => {
//     // console.log(req['file'])
//     try{
//     console.log("in",'http://localhost:5000/myuploads/'+req.file.filename);
//     res.send('http://localhost:5000/myuploads/'+req.file.filename)
//   }catch(err){
//     console.log(err)
//     res.send("Error")
//   }
// })


app.post("/upload", (req,res) => {
  upload(req, res, (err) => {
     console.log("Request ---", req.body);
     console.log("Request file ---", req.file);//Here you get file.
     /*Now do where ever you want to do*/
     if(!err){
        console.log('http://localhost:5000/myuploads/'+req.file.filename)
        res.send('http://localhost:5000/myuploads/'+req.file.filename)
     }
    else{
         console.log('Error')
         res.send("error")
        }
    })}
)

io.on('connection', function(socket){
    console.log('connected');
    // console.log('connected users ',connections.push(socket)) 

    socket.on('message', (data) => {
        // console.log('data',data)
        console.log("message 5", data)
        // console.log("message socket", req.file)


        let sender = data.sender.uid;
        let receiver = data.sender.receiver;
        let message = data.text;
        let timestamp = data.timestamp;
        let likeflag = data.likeflag;
        let tickflag = data.tickflag;
        let image = data.imageUrl;
        let messageflag = data.messageflag;

        // app.post('/uploadphoto', upload.single('picture'), (req, res) => {
            
        // })
        
        conn.pool.query(`insert into user_data(sender, receiver, message, timestamp, likeflag, tickflag, images, messageflag) values ($1, $2, $3, $4, $5, $6, $7, $8)`, [sender, receiver, message, timestamp, likeflag, tickflag, image, messageflag], 
        (err, response) => {
            if(err)
                console.log(err)
            if(response){
                console.log("channelid backend", data.id)
                console.log("response 6", response)
                // response.send("saved");
                io.sockets.emit(data.id, data)         
            }
            })
    })

    socket.on("groupmessage", (data) => {
        console.log("socket groupmessage", data)
        
        conn.pool.query("insert into groupchat(group_name, message, sender, timestamp, likeflag, images) values($1, $2, $3, $4, $5, $6)", [data.groupname, data.text, data.sender, data.timestamp, data.likeflag, data.imageUrl],
                    (err, response) => {
                        if(err)
                            console.log(err)
                        if(response){
                            console.log("groupmessage")
                            console.log("receiver", data.groupname)
                            console.log(response)
                            io.sockets.emit(data.groupname, data)
                        }
                    })
    })

    socket.on("softdelete", (data)=> {
        console.log(data.timestamp)
        console.log(data.id)

        data.flag ? 
        conn.pool.query("update user_data set messageflag=$1 where timestamp=$2", [false, data.timestamp], (err, response)=>{
            if(err)
            {
                console.log("error")
            }
            if(response){
                console.log("response", response, data.id)
                io.sockets.emit(data.id + "softdelete", data.timestamp)
            }
        } )
        : conn.pool.query("update groupchat set messageflag=$1 where timestamp=$2", [false, data.timestamp], (err, response)=>{
            if(err)
            {
                console.log("error")
            }
            if(response){
                console.log("response", response, data.id)
                io.sockets.emit(data.id + "softdelete", data.timestamp)
            }
        } )
    })


    socket.on("disconnect", function(){
        console.log("user disconnected")
    })
})


const userRoute = require('./routes/userRoute');
const userMessages = require('./routes/usermessages')
server.listen(5000, () => { console.log('running port')})

app.use(cors())

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

app.use('/userroute', userRoute)
app.use('/usermessages', userMessages)
app.use('/group', group)
