const express = require('express');
const app = express();
const bodyParser = require('body-parser')

const { Pool } = require('pg');
const pool = new Pool({
    host: 'postgis',
    user: 'postgres',
    password: '1234',
    database: 'app_usc',
    port: 5432,
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use('/', express.static('www'))

app.listen(3500, () => {
    console.log("http://localhost:3500")
});

// api 
app.get('/api/geojson/:aq/:year', async (req, res) => {
    const { aq, year } = req.params
    try {
        const result = await pool.query(`
        SELECT json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg(ST_AsGeoJSON(t.*)::json)
        ) AS geojson
        FROM ${aq} t
        WHERE year=${year};
      `);

        res.json(result.rows[0].geojson);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from database');
    }
});

app.get("/api/getminmax/:aq/:year/:day", async (req, res) => {
    const { aq, year, day } = req.params
    console.log(aq, year, day);

    try {
        const result = await pool.query(`
        SELECT min(${day}), max(${day}) FROM ${aq}
        WHERE year=${year} AND usc != 'NaN';
      `);
        console.log(result);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from database');
    }
})