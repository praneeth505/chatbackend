var conn = require('../config/config');
const uuidv1 = require('uuid/v1')

addGroup = (req, res) => {
    console.log(req.body.groupname);
    var groupid = uuidv1();
    var groupname = req.body.groupName;
    // var message = req.body.message;
    // var sender = req.body.sender;
    // console.log("reqbody",req.body.groupName)
    console.log("groupcontroller",groupname);
    // console.log()
    conn.pool.query("INSERT INTO groups(group_id, group_name) VALUES ($1, $2)", [groupid, groupname],
        (err, response) => {
            if(err)
                console.log(err)
            if(response)
            {
                let data = {
                    groupId: groupid,
                    groupName: groupname
                }
                res.send(data)
            }
        })
}

getGroups = (req, res) => {
    console.log("groups")
    conn.pool.query("select * from groups", 
    (err, response) => {
        if(err)
            console.log(err);
        else
            res.send(response)
            // console.log(response)
    })
}

getMessage = (req, res) => {
    console.log("getgroups", req.body.groupname);
    let group_name = req.body.groupname;

    conn.pool.query("select * from groupchat where group_name=$1 order by timestamp asc", [group_name], 
        (err, response) => {
            if(err)
                console.log(err)
            if(response)
                res.send(response)
        })
}


getMessageOffset = (req, res) => {
    console.log("groupsoffset", req.body.groupname);
    let group_name = req.body.groupname;
    // let limit = req.query.limit;
    // let offset = req.query.offset;

    conn.pool.query("select * from groupchat where group_name=$1 order by timestamp asc ", [group_name], 
        (err, response) => {
            if(err)
                console.log(err)
            if(response)
                res.send(response)
        })
}

module.exports =  { addGroup, getGroups, getMessage, getMessageOffset }

