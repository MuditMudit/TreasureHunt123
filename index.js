const { MongoClient, ServerApiVersion } = require("mongodb");
const cookieParser = require('cookie-parser');
const express = require('express');
const fs = require('fs');
const url = require('url');
const app = express();
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());
const path = require('path');

app.set('view engine', 'ejs');

const uri = 'mongodb+srv://madscam505:madscam123@treasurehunt.mfetqkj.mongodb.net/?retryWrites=true&w=majority';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
}
);

async function run() {
    await client.connect();
    app.post('/auth/signup/', async (req, res) => {
        console.log(req.body);
        console.log(Buffer.from(`${req.body.email}-@-${req.body.password}`).toString('base64'));
        if (!req.body.email || !req.body.name || !req.body.password) {
            res.send({ status: 'error', error: 'Wrong API Data Sent' });
        } else {
            const dataUser = await client
                .db('treasureHunt')
                .collection('users')
                .findOne({ token: Buffer.from(`${req.body.email}-@-${req.body.password}`).toString('base64') });
            if (dataUser) {
                res.send({ status: 'error', error: 'User Already Exists' });
            } else {
                await client
                    .db('treasureHunt')
                    .collection('users')
                    .insertOne({
                        token: Buffer.from(`${req.body.email}-@-${req.body.password}`).toString('base64'), email: req.body.email, attemps: 0,
                            deadends:0,name: req.body.name, data: {
                            currentStep: 1, 
                            
                            time: {
                                "step-1": 0,
                                "step-2": 0,
                                "step-3": 0
                            }
                        },
                    });
                res.send({ status: "sucess", message: "data updated successfully", data: Buffer.from(`${req.body.email}-@-${req.body.password}`).toString('base64') })
            }
        }
    });
    app.get('/getUserDetails/', async (req, res) => {
        const data = await client
            .db('treasureHunt')
            .collection('users')
            .find({}).toArray();
        if (data) res.send({ status: 'success', data });
        else res.send({ status: 'error', error: 'User Token Issue' });

    });
    app.post('/login/', async (req, res) => {
        if (!client) await reconnect();
        const dataUser = client
            .db('treasureHunt')
            .collection('users')
            .findOne({ token: Buffer.from(`${req.body.email}-@-${req.body.password}`).toString('base64') });
        if (dataUser) { res.send({ status: 'success', data: Buffer.from(`${req.body.email}-@-${req.body.password}`).toString('base64')})}
        else {
            res.send({ status: 'error', error: 'Wrong Email or password' });
        }
    })
    app.get('/treasureHunt', async (req, res) => {
        const token = req.cookies.userToken;
        if (token) {
            const curStep = await client
                .db('treasureHunt')
                .collection('users')
                .findOne({ token: token });
            console.log(curStep);
            switch (curStep.data.currentStep) {
                case 1: {
                    res.render('normal/login');
                    break;
                }
                case 2: {
                    res.render('normal/clue2');
                    break;
                }
                case 3: {
                    res.render('normal/clue3');
                    break;
                }
                case 4: {
                    res.render('normal/treasure');
                    break;
                }
                case 5: {
                    res.render('normal/DeadEND');
                    break;
                }
                default: {
                    res.render('auth/login');
                    break;
                }
            }
        } else {
            res.render('auth/signup');
        }
    });
    app.post('/setStep', async (req, res) => {
        console.log(req.body.step);
        const setStatus = await client
            .db('treasureHunt')
            .collection('users')
            .updateOne(
                { token: req.cookies.userToken },
                { $set: { data: { currentStep: req.body.step } } }
            );
        console.log(setStatus, req.cookies.userToken);
        // {
        //     acknowledged: true,
        //     modifiedCount: 0,
        //     upsertedId: null,
        //     upsertedCount: 0,
        //     matchedCount: 0
        //   }
        if (setStatus) {
            res.send({ status: "success", message: "Step Updated Successfully" })
        } else {
            res.send({ status: "error", message: "error in update" });
        }
    });
    app.post('/attempts', async (req, res) => {
        const setStatus = await client
            .db('treasureHunt')
            .collection('users')
            .updateOne(
                { token: req.cookies.userToken },
                { $inc: { attempts: 1 }}
            );
        console.log(setStatus, req.cookies.userToken);
        // {
        //     acknowledged: true,
        //     modifiedCount: 0,
        //     upsertedId: null,
        //     upsertedCount: 0,
        //     matchedCount: 0
        //   }
        if (setStatus) {
            res.send({ status: "success", message: "Attempts Updated Successfully" })
        } else {
            res.send({ status: "error", message: "error in update" });
        }
    });
    app.post('/deadEnds', async (req, res) => {
        const setStatus = await client
            .db('treasureHunt')
            .collection('users')
            .updateOne(
                { token: req.cookies.userToken },
                { $inc: {deadends: 1 } }
            );
        // {
        //     acknowledged: true,
        //     modifiedCount: 0,
        //     upsertedId: null,
        //     upsertedCount: 0,
        //     matchedCount: 0
        //   }
        if (setStatus) {
            res.send({ status: "success", message: "Attempts Updated Successfully" })
        } else {
            res.send({ status: "error", message: "error in update" });
        }
    });
    app.get('/:type/:view/', (req, res) => {
        if (fs.existsSync(`${__dirname}/views/${req.params.type}/${req.params.view}.ejs`)) {
          try {
            res.render(`${req.params.type}/${req.params.view}`, { url: decodeURI(path.normalize(url.parse(req.url).pathname)) });
          } catch (renderError) {
            res.render('normal/404', { error: renderError, url: decodeURI(path.normalize(url.parse(req.url).pathname)) });
          }
        } else {
          res.render('normal/404', { error: 'Page Does Not Exists', url: decodeURI(path.normalize(url.parse(req.url).pathname)) });
        }
      });
    app.get('/*', (req, res) => {
        if (req.cookies.userToken) {
            const user = client
                .db('treasureHunt')
                .collection('users')
                .findOne({ token: req.cookies.userToken });
            if (user) {
                res.redirect('/treasureHunt');
            }
        } else { res.render('auth/signup'); }
    });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    app.listen(process.env.PORT || 5001, () => {
        console.log(`Listening on port ${process.env.PORT || 5001}`);
    });
};
run()
