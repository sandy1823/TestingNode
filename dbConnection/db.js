var { Client } = require('pg')

var client = new Client({
    port: '5432',
    host: 'localhost',
    user: 'postgres',
    password: 'santhosh',
    database: 'sampledatabase'
})


client.connect().then((res) => {
    console.log("resss", res);
}).catch((err) => console.log(err, "err"))


module.exports={
    client
}