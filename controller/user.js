var conn = require('../config/config');

saveUserData = (req, res) => {
// const {email,nickname,password}=req.body;
// console.log(req.body);
// res.send('success');
    let email = req.body.email;
    let nickName = req.body.nickname;
    let password = req.body.password;
    let loginflag = false;
    // var tickflag = 1;
    
    let data = {
        email: email,
        nickname: nickName,
        password: password,
        loginflag: loginflag
    }

    conn.pool.query('insert into userchat(email, nickname, password, loginflag) VALUES ($1,$2, $3, $4)',[email, nickName, password, loginflag], 
    (error, response) => {
        if(error)
            res.send(error);

        if(response){
            console.log(loginflag)
            res.send(data)
        }
    })
}  

updateLoginFlag = (req, res) => {

     let email = req.body.email;
     let password = req.body.password;
     let loginflag = true;

     conn.pool.query("update userchat set loginflag = $1 where email = $2 and password=$3", [loginflag, email, password], 
        (err, response) => {
            res.send(response)
            // console.log('get login data')
            // console.log('updated row count',response.rowCount)
        })
}

getOnlineUsers = (req, res) => {
    conn.pool.query("select * from userchat where loginflag = $1", [true],
    (err, response) => {
        res.send(response.rows)
    })
}

module.exports =  {saveUserData, updateLoginFlag, getOnlineUsers}  




