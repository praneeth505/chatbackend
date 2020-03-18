
// const { Client} = require('pg')
// const connectionString = "postgresql://postgres:postgres@localhost:5432/chatbot";

// const client = new Client({
//     connectionString: connectionString
// })

// if(client.connect()){
//     console.log("Connected")
//     let res=client.query("select * from user")
//     res.then((res)=>{
//         console.log(res)
//     })
// }

// module.exports = {client}

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'chatbox',
  password: 'postgres',
  port: 5432,
})

module.exports={
    pool
};










