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
app.get('/api/geojson', async (req, res) => {
    try {
        const result = await pool.query(`
        SELECT json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg(ST_AsGeoJSON(t.*)::json)
        ) AS geojson
        FROM public.so2 t;
      `);

        res.json(result.rows[0].geojson);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from database');
    }
});