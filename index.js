const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken')
const port = process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(cors());


const { MongoClient, ServerApiVersion } = require('mongodb');
const { hashPassword } = require('./middlewares');
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const createToken = (user) => {
    const tokenData = { email: user?.email, role: user?.role };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET);
    return token;
};

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const dataBase = client.db('Mobile-financial-system');
        const userCollections = dataBase.collection('users');

        //authentication apis
        app.post('/register', hashPassword, async (req, res) => {
            try {
                const data = req.body;
                console.log(data);
                const isUserExists = await userCollections.findOne({ phoneNumber: data.phoneNumber });
                if (isUserExists) {
                    return res.json({
                        success: false,
                        error: 'user already exists with this phone number!',
                    });
                }

                const result = await userCollections.insertOne(data);
                const token = createToken(data);
                console.log(token);
                return res.json({
                    success: true,
                    message: 'user created successfully',
                    data: result,
                    token
                });
            } catch (err) {
                return res.json({
                    success: false,
                    error: err?.message,
                });
            };
        });


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    return res.send('mobile financial system server start');
});

app.listen(port, () => {
    console.log('server is running on', port);
});