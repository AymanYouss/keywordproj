// api/trends.js
const googleTrends = require('google-trends-api');

module.exports = (req, res) => {
    const keyword = req.query.keyword;
    googleTrends.interestOverTime({ keyword: keyword })
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            console.error(`Error fetching trends for keyword: ${keyword}`, error);
            res.status(500).send({ error: "Failed to fetch trends data" });
        });
};
