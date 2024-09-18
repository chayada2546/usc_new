mapboxgl.accessToken = 'pk.eyJ1IjoiZG9va2RhIiwiYSI6ImNscTM3azN3OTA4dmEyaXF1bmg3cXRvbDUifQ.d1Ovd_n9PwJqc_MdGS66-A';
const map = new mapboxgl.Map({
    container: 'map',
    // style: 'mapbox://styles/mapbox/streets-v9',
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

const layerObjectJson = (id, source, column) => {
    return {
        'id': id,
        'type': 'fill', // Layer type for polygons
        'source': source,
        'paint': {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', column],
                -0.000252, '#f28cb1',
                0, '#f1f075',
                0.000528, '#51bbd6'
            ],
            'fill-opacity': 0.2,
            'fill-outline-color': '#000000'
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

const layerObjectWms = (id, source) => {
    return {
        'id': id,
        'type': 'raster',
        'source': source,
        'paint': {}
    }
}

map.on('load', async () => {
    const response = await fetch('/api/geojson');
    const data = await response.json();
    map.addSource('so2-source', {
        type: 'geojson',
        data: data
    });

    map.addSource('wms-source', {
        'type': 'raster',
        'tiles': [
            `http://localhost:8080/geoserver/nurc/wms?service=WMS&version=1.1.0&request=GetMap&layers=nurc%3Amosaic&bbox=6.346%2C36.492%2C20.83%2C46.591&width=768&height=535&srs=EPSG%3A4326&styles=&format=image%2Fpng`
        ],
        'tileSize': 256 // The size of each tile
    });

    map.addLayer({
        'id': 'wms-layer',
        'type': 'raster',
        'source': 'wms-source',
        'paint': {}
    });
})

function buildingChk() {
    const div = document.getElementById('building');
    const hex = layerObject('3d-buildings', 'composite', 'height');
    if (div.checked) {
        map.addLayer(hex);
    } else {
        map.removeLayer('3d-buildings');
    }
}

function hexChk() {
    const div = document.getElementById('hex');
    const id = 'so2-layer';
    const source = 'so2-source';
    const hex = layerObjectJsonHeight(id, source, 'mon', 5000000);
    if (div.checked) {
        map.addLayer(hex);
    } else {
        map.removeLayer(id);
    }
}
function wmsChk() {
    const div = document.getElementById('wms');
    const id = 'wms-layer';
    const source = 'wms-source';
    const hex = layerObjectWms(id, source);
    if (div.checked) {
        map.addLayer(hex);
    } else {
        map.removeLayer(id);
    }
}
