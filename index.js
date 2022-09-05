const express = require('express');
const fs = require('fs')
const cors = require('cors')
const port = 5000;
const app = express();
const bodyParser = require('body-parser');
const { appendFile } = require('fs/promises');
const useRouter = require("./Routes/route")



app.use(cors())
app.use(express.json())
app.use(bodyParser.json())


// 1.get a random user 
app.use('/', useRouter)



app.listen(port, () => {
    console.log(`running in port ${port}`);
});