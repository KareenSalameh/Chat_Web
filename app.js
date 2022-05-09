const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const port = 12329;
var database;

app.use("/static", express.static('./static/'));
app.use("/images", express.static('./images/'));
app.set('view engine', 'ejs');
const usrs = []
fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
    database = JSON.parse(data);
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static/login.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'static/index.html'));
});


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'static/login.html'));
});

app.get('/sign', (req, res) => {
    res.sendFile(path.join(__dirname, 'static/sign.html'));
});

app.get('/listUsers', (req, res) => {
    res.render("users", { "users": database });
});


app.get('/',(req, res)=> {
    if(req.query.username === "foo" && req.query.password === "bar")
    res.send('/')
})

app.post('/sign', (req, res) => {
    id = req.query.id;
    password = req.query.password;
    nickname = req.query.nickname;
    n = req.query.name;

    database["user" + id] = {
        "name": n,
        "nickname": nickname,
        "password": password,
        "id": id
    }
    res.redirect('/login')
    console.log(usrs)
})


app.post('/addUser', (req, res) => {
    id = req.query.id;
    password = req.query.password;
    nickname = req.query.nickname;
    n = req.query.name;

    database["user" + id] = {
        "name": n,
        "nickname": nickname,
        "password": password,
        "id": id
    }

    var ul = document.getElementById('lst');
    var li = document.createElement('li');
    li.className = "list-group-item d-flex align-items-center";

    var img = document.createElement('img');
    img.src = "/static/icon.png";
    img.className = "userimage";

    var span = document.createElement('span');
    span.innerHTML = nickname;

    var cite = document.createElement('cite');
    cite.className = "w-100 ms-5";
    cite.title = "Source Title";
    cite.innerHTML = "1 minute ago";

    li.appendChild(img);
    li.appendChild(span);
    li.appendChild(cite);
    ul.appendChild(li);
});

app.listen(port, '0.0.0.0');
