const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    return res.send('mobile financial system server start');
});

app.listen(port, () => {
    console.log('server is running on', port);
});