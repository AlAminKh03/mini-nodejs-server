const express = require('express');
const fs = require('fs')
const cors = require('cors')
const port = 5000;
const app = express();
const bodyParser = require('body-parser');
const { appendFile } = require('fs/promises');

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

app.get('/', (req, res) => {

    fs.readFile("users.json", (err, data) => {
        if (err) {
            res.send('data was not found')
        } else {
            res.send(JSON.parse(data))
        }
    })
})

app.get('/user/random', (req, res) => {
    fs.readFile("users.json", (err, data) => {
        if (err) {
            res.send('data was not found')
        } else {
            const users = JSON.parse(data)
            const randomUser = users[Math.floor(Math.random() * users.length) + 1]
            res.send(JSON.stringify(randomUser))
        }
    })
})
app.post('/addusers', (req, res) => {
    const user = req.body;


    fs.readFile("users.json", (err, data) => {
        if (err) {
            res.send('data was not found')
        } else {
            const allUser = JSON.parse(data);
            allUser.push(user);
            fs.writeFile(`${__dirname}/users.json`, JSON.stringify(allUser), (err) => {
                if (err) {
                    res.send('Failed to append file')
                } else {
                    res.send("user has succesfully added")
                }
            })
        }
    })


})



app.listen(port, () => {
    console.log(`running in port ${port}`);
});