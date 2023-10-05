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

router.post('/register', validateUser, (req,res,next) => {
        let sqlQury = 'insert into login (username,password,gmail) values($1,$2,$3)';
        bcrypt.hash(req.body.password.toString(),saltRounds,(err,hash) =>{
            console.log("Hashhh",hash);
            if(err) return res.json({Error:'for hashing password'})
            let values = [
                req.body.userName,
                req.body.email,
                hash
            ]
            client.query(sqlQury,values,(err,result)=>{
                if(err) return res.json({Error:err})    
                else{
                    res.json({status:'200'})
                }
            })
        })
       
})

module.exports = router