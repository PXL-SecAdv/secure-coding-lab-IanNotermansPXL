const pg = require('pg');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')

const port=3000;

const pool = new pg.Pool({
    user: 'secadv',
    host: 'db',
    database: 'pxldb',
    password: 'ilovesecurity',
    port: 5432,
    connectionTimeoutMillis: 5000
})

console.log("Connecting...:")

const corsOptions = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/authenticate/:username/:password', async (request, response) => {
    const username = request.params.username;
    const password = request.params.password;

    const query = 'SELECT * FROM users WHERE user_name=$1 AND password = crypt($2, password)';
    const values = [username, password];

    try {
        const results = await pool.query(query, values);
        if (results.rows.length > 0) {
            response.status(200).json({ message: 'Authentication successful.' });
        } else {
            response.status(401).json({ error: 'Authentication failed.' });
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

