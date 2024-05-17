// api/trends.js
const express = require('express');
const googleTrends = require('google-trends-api');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

module.exports = (req, res) => {
    const keyword = req.query.keyword;
    console.log(`Received request for keyword: ${keyword}`);
    googleTrends.interestOverTime({ keyword: keyword })
        .then(response => {
            console.log(`Sending response for keyword: ${keyword}`);
            res.send(response);
        })
        .catch(error => {
            console.error(`Error fetching trends for keyword: ${keyword}`, error);
            res.status(500).send(error);
        });
};
