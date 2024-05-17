const express = require('express');
const googleTrends = require('google-trends-api');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/trends', (req, res) => {
    const keyword = req.query.keyword;
    console.log(`Received request for keyword: ${keyword}`); // Log received keyword
    googleTrends.interestOverTime({ keyword: keyword })
        .then(response => {
            console.log(`Sending response for keyword: ${keyword}`); // Log successful response
            res.send(response);
        })
        .catch(error => {
            console.error(`Error fetching trends for keyword: ${keyword}`, error); // Log errors
            res.status(500).send(error);
        });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
