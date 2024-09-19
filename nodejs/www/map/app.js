mapboxgl.accessToken = 'pk.eyJ1IjoiZG9va2RhIiwiYSI6ImNscTM3azN3OTA4dmEyaXF1bmg3cXRvbDUifQ.d1Ovd_n9PwJqc_MdGS66-A';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    projection: 'globe',
    center: [98.9890399899238, 18.785643277053523],
    zoom: 15.5,
    pitch: 45
});

map.addControl(new mapboxgl.NavigationControl());

map.on('click', (e) => {
    console.log(e.lngLat);
});

const layerObject = (id, source, column) => {
    return {
        'id': id,
        'source': source,
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', column]
            ],
            'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
        }
    }
}

const layerObjectJsonHeight = (id, source, column, multiplyNumber, min, max) => {
    try {
        return {
            'id': id,
            'type': 'fill-extrusion',
            'source': source,
            'paint': {
                'fill-extrusion-color': [
                    'interpolate',
                    ['linear'],
                    ['get', column],
                    Number(min), '#f28cb1',
                    ((Number(max) - Number(min)) / 2) + Number(min), '#f1f075',
                    Number(max), '#51bbd6'
                ],
                'fill-extrusion-height': [
                    '*',
                    ['get', column],
                    multiplyNumber
                ],
                'fill-extrusion-base': 0,
                'fill-extrusion-opacity': 0.8
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const layerObjectUsc = (id, source, column, multiplyNumber) => {
    return {
        'id': id,
        'type': 'fill-extrusion',
        'source': source,
        'paint': {
            'fill-extrusion-color': [
                'interpolate',
                ['linear'],
                ['get', column],
                0.095, '#6EC207',
                2.0, '#FFEB00',
                5.784, '#D91656'
            ],
            'fill-extrusion-height': [
                '*',
                ['get', column],
                multiplyNumber
            ],
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': 0.8
        }
    }
}

const layerObjectWms = (id, source) => {
    return {
        'id': id,
        'type': 'raster',
        'source': source,
        'paint': {}
    }
}

map.on('load', async () => {
    console.log("Map loaded");
});

async function getData() {
    const typePollutant = document.getElementById('type-pollutant').value;
    const year = document.getElementById('year').value;
    const datasource = typePollutant + year;

    document.getElementById('datasource').value = datasource;
    document.getElementById('typePollutantName').innerHTML = typePollutant;

    const response = await fetch(`/api/geojson/${typePollutant}/${year}`);
    const data = await response.json();

    map.addSource(datasource, {
        type: 'geojson',
        data: data
    });
}

async function hexSel() {
    try {
        const typePollutant = document.getElementById('type-pollutant').value;
        const year = document.getElementById('year').value;
        const day = document.getElementById('day').value;
        const response = await axios.get(`/api/getminmax/${typePollutant}/${year}/${day}`);
        const minMax = response.data[0];  // No need for extra await

        let k = (typePollutant === "CO") ? 5000 : (typePollutant === "NO2" || typePollutant === "SO2") ? 5000000 : 2000;

        const datasource = document.getElementById("datasource").value;
        const id = 'display-layer';
        const hex = layerObjectJsonHeight(id, datasource, day, k, minMax.min, minMax.max);

        const style = map.getStyle();
        const layer = style.layers.find(layer => layer.id === id);

        if (layer) {
            map.removeLayer(id);
        }
        map.addLayer(hex);
    } catch (error) {
        console.log(error);
    }
}

async function hexChk() {
    try {
        const typePollutant = document.getElementById('type-pollutant').value;
        const year = document.getElementById('year').value; // Add the missing year
        const day = document.getElementById('day').value;
        const response = await axios.get(`/api/getminmax/${typePollutant}/${year}/${day}`);
        const minMax = response.data[0];

        let k = (typePollutant === "CO") ? 5000 : (typePollutant === "NO2" || typePollutant === "SO2") ? 5000000 : 2000;

        const datasource = document.getElementById("datasource").value;
        const id = 'display-layer';
        const hex = layerObjectJsonHeight(id, datasource, day, k, minMax.min, minMax.max);

        const div = document.getElementById('hex');
        if (div.checked) {
            map.addLayer(hex);
        } else {
            map.removeLayer(id);
        }
    } catch (error) {
        console.log(error);
    }
}

function uscChk() {
    let k = 100;

    const datasource = document.getElementById("datasource").value;
    const usc = document.getElementById('usc');
    const id = 'display-usc';

    const hex = layerObjectUsc(id, datasource, 'usc', k);
    if (usc.checked) {
        map.addLayer(hex);
    } else {
        map.removeLayer(id);
    }
}
