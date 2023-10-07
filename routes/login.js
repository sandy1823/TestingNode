const express = require('express');
const router = express.Router();
const { client } = require('../dbConnection/db');
const bcrypt = require('bcrypt');

const saltRounds = 10;


function validateUser(req, res, next) {
    let { userName, email, password } = req.body
    if (userName == null || email == null || password == null) {
        res.send('Please check the credintial')
    } else {
        next()
    }
}

router.post('/register', validateUser, (req, res, next) => {
    let sqlQury = 'insert into login (username,password,gmail) values($1,$2,$3)';
    bcrypt.hash(req.body.password.toString(), saltRounds, (err, hash) => {
        console.log("Hashhh", hash);
        if (err) return res.json({ Error: 'for hashing password' })
        let values = [
            req.body.userName,
            hash,
            req.body.email
        ]
        client.query(sqlQury, values, (err, result) => {
            if (err) return res.json({ Error: err })
            else {
                res.json({ status: '200' })
            }
        })
    })

})


router.get('/login', async (req, res) => {
    console.log("reqqqq,",req.body);
    let selectQuery = `select * from login where gmail = $1`
    console.log("db query", await client.query(selectQuery, [req.body.email]));
    client.query(selectQuery, [req.body.email], (err, result) => {
        res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
        console.log(err, "ress result", result.rows[0]);
        if (err) return res.json({ Error: `server error${err} ` })
        if (result.rows.length > 0) {
            bcrypt.compare(req.body.password.toString(), result.rows[0].password, (errs, data) => {
                console.log("ress data", data);
                if (errs) return res.send("password compare error")
                if (data.length > 0) {
                    return res.json({ status: 'success' })
                } else {
                    return res.json({ status: 'password not matched' })
                }
            })
        }

    })
})
module.exports = router