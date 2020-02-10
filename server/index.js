const express = require('express');
const cors = require('cors');
const monk = require('monk');
const app = express();
const db = monk(process.env.MONGO_URI || 'localhost/mini');
const minis = db.get('minis');
const Filter = require('bad-words');
const filter = new Filter();
const rateLimit = require('express-rate-limit');

app.use(cors());
app.use(express.json());


app.get('/', (req,res) => {
    res.json({
        message: 'HI'
    })
});

function isValidMini(mini) {
    return mini.name && mini.name.toString().trim() !== '' && 
        mini.content && mini.content.toString().trim() !== '';
}

app.use(rateLimit({
    windowMs: 30*1000, //30 seconds
    max: 1
}));

app.get('/mini', (req,res) => {
    minis
        .find()
        .then(mini => {
            res.json(mini);
        })
})

app.post('/mini', (req,res) => {
    if(isValidMini(req.body)){
        const mini = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        };

        minis
            .insert(mini)
            .then(createdMini => {
                res.json(createdMini);
            });
    } else {
        res.status(422);
        res.json({
            message: 'Hey name and content are required!'
        })
    }
    console.log(req.body);
})

app.listen(5000, () => {
    console.log('Listening on port 5000');
});