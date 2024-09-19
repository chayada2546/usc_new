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

const layerObjectJsonHeight = (id, source, column, multiplyNumber) => {
    return {
        'id': id,
        'type': 'fill-extrusion',
        'source': source,
        'paint': {
            'fill-extrusion-color': [
                'interpolate',
                ['linear'],
                ['get', column],
                -0.000252, '#f28cb1',
                0, '#f1f075',
                0.000528, '#51bbd6'
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
    console.log("load");
});

async function getData() {
    const typePollutant = document.getElementById('type-pollutant').value;
    const year = document.getElementById('year').value;
    const datasource = typePollutant + year;

    document.getElementById('datasource').value = datasource
    console.log(datasource)

    const response = await fetch(`/api/geojson/${typePollutant}/${year}`);
    const data = await response.json();

    map.addSource(datasource, {
        type: 'geojson',
        data: data
    });
}

// map.addSource('wms-source', {
//     'type': 'raster',
//     'tiles': [
//         `http://localhost:8080/geoserver/nurc/wms?service=WMS&version=1.1.0&request=GetMap&layers=nurc%3Amosaic&bbox=6.346%2C36.492%2C20.83%2C46.591&width=768&height=535&srs=EPSG%3A4326&styles=&format=image%2Fpng`
//     ],
//     'tileSize': 256
// });

function buildingChk() {
    const div = document.getElementById('building');
    const hex = layerObject('3d-buildings', 'composite', 'height');
    if (div.checked) {
        map.addLayer(hex);
    } else {
        map.removeLayer('3d-buildings');
    }
}

function hexSel() {
    const typePollutant = document.getElementById('type-pollutant').value;
    let k = 0;
    if (typePollutant == "CO") {
        k = 3000
    } else if (typePollutant == "NO2") {
        k = 50000
    } else if (typePollutant == "SO2") {
        k = 5000000
    } else {
        k = 2000
    }

    const datasource = document.getElementById("datasource").value;
    const day = document.getElementById("day").value;
    const id = 'display-layer';
    const hex = layerObjectJsonHeight(id, datasource, day, k);

    const style = map.getStyle();
    const layers = style.layers;
    layers.forEach(layer => {
        if (layer.id == id) {
            map.removeLayer(id);
            map.addLayer(hex);
        } else {
            map.addLayer(hex);
        }
    });
}

function hexChk() {
    const typePollutant = document.getElementById('type-pollutant').value;
    let k = 0;
    if (typePollutant == "CO") {
        k = 100000
    } else if (typePollutant == "NO2") {
        k = 30000
    } else if (typePollutant == "SO2") {
        k = 5000000
    } else {
        k = 1000
    }
    const datasource = document.getElementById("datasource").value;
    const day = document.getElementById("day").value
    const div = document.getElementById('hex');
    const id = 'display-layer';

    const hex = layerObjectJsonHeight(id, datasource, day, k);
    if (div.checked) {
        map.addLayer(hex);
    } else {
        map.removeLayer(id);
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

