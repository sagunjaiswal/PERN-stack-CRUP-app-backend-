const client = require('./connection.js')
const express = require('express');
const app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());




app.listen(3300, ()=>{
    console.log("Server is now listening at port 3300");
})

client.connect();

app.get('/users', (req, res)=>{
    client.query(`Select * from users`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})

app.post('/users', async (req, res)=> {
    const user = req.body;
    //validtion
    //all fields required
    if (!user.id || !user.login || !user.password || !user.age || !user.isdeleted)
      return res.status(400).json({ msg: "Not all fields have been entered" });
    //age validation 
    if(user.age < 4 || user.age > 130){
        return res.status(400).json({ msg: "age should be between 4 and 130" });
    }
    //password validation
    let letterNumber = /^[0-9a-zA-Z]+$/;
    // if(!user.password.value.match(letterNumber)){
    let alphaCheck = false, numCheck = false;
    for(let i = 0 ; i < user.password.length ; i++){
        if(user.password[i] >= '0' && user.password[i] <= '9')
            numCheck = true;
        if(user.password[i] >= 'a' && user.password[i] <= 'z')
            alphaCheck = true;
        if(user.password[i] >= 'A' && user.password[i] <= 'Z')
            alphaCheck = true;
    }
    if(!letterNumber.test(user.password))
    {
    
        return res
        .status(400)
        .json({ msg: "The password needs only alphabets and numbers!!" });
    }
    if (!alphaCheck || !numCheck){
        return res
        .status(400)
        .json({ msg: "The password needs to have alphabets and numbers!!" });
    }
    
    let insertQuery = `insert into users(id, login, password, age, isdeleted)
                       values('${user.id}', '${user.login}', '${user.password}', ${user.age}, ${user.isdeleted})`

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Insertion was successful')
        }
        else{ 
            
            return res
         .status(400)
         .json({ msg: err.message});
         }
    })
    client.end;
})

app.put('/users/:id', (req, res)=> {
    let user = req.body;
    let updateQuery = `update users
                       set login = '${user.login}',
                       password = '${user.password}',
                        age = ${user.age},
                        isdeleted = ${user.isdeleted}
                       where id = '${user.id}'`

    client.query(updateQuery, (err, result)=>{
        if(!err){
            res.send('Update was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})
app.delete('/users/:id', (req, res)=> {
    // console.log(req.params);
    
    let insertQuery = `delete from users where id='${req.params.id}'`

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Deletion was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})

app.get('/users/:queryStr', (req, res)=> {
    if(isNaN(req.params.queryStr)){
        const queryStr = req.params.queryStr;
        const usp = new URLSearchParams(queryStr);
        const loginSub = usp.get('loginSubstring');
        const lim = usp.get('limit');
    
        client.query(` SELECT * FROM USERS WHERE login ~ '${loginSub}' LIMIT ${lim};`, (err, result)=>{
            if(!err){
                res.send(result.rows);
            }
        });
        client.end;
    }
    else{
        client.query(`Select * from users where id='${req.params.queryStr}'`, (err, result)=>{
            if(!err){
                res.send(result.rows);
            }
        });
        client.end;
    }
    
});