const express = require('express');
const cors = require('cors')
const port = process.env.port || 5000;
const app = express();
const bodyParser = require('body-parser');
const useRouter = require("./Routes/route")



app.use(cors())
app.use(express.json())
app.use(bodyParser.json())


// 1.get a random user 
app.use('/', useRouter)



app.listen(port, () => {
    console.log(`running in port ${port}`);
});