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

app.get('/users/:id', (req, res)=>{
    client.query(`Select * from users where id='${req.params.id}'`, (err, result)=>{
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
    let insertQuery = `delete from users where id='${req.params.id}'`

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Deletion was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})