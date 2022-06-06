const client = require('./connection.js')
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.listen(3300, ()=>{
    console.log("Sever is now listening at port 3300");
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

app.post('/users', (req, res)=> {
    const user = req.body;
    console.log("request body "+ user);
    let insertQuery = `insert into users(id, login, password, age, isdeleted)
                       values('${user.id}', '${user.login}', '${user.password}', ${user.age}, ${user.isdeleted})`

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Insertion was successful')
        }
        else{ 
            
            console.log(err.message);
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