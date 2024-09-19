const map = L.map("map", {
    center: [18.788798983151977, 98.98539497984945],
    zoom: 12
});

// Define tile layers
const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
const Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Esri (Thailand), TomTom'
});
const Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'ESRI'
});
const google_Terrain = L.tileLayer('https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    attribution: 'Google Maps'
});
Esri_WorldImagery.addTo(map);

// Overlay layers
const amphoe = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/CM/wms?", {
    layers: "CM:amphoe_cm",
    format: "image/png",
    transparent: true
});

// Base map options
const baseMap = {
    "ESRI Imagery": Esri_WorldImagery,
    "Google Terrain": google_Terrain,
    "OSM": osm,
    "ESRI Street": Esri_WorldStreetMap
};

// Overlay map options
const overlayMap = {
    "Amphoe": amphoe
};

// Add layers control to the map
L.control.layers(baseMap, overlayMap).addTo(map);

// Fetch data for specific pollutants
const API_URLS = {
    CO: 'http://localhost:3500/api/co/',
    NO2: 'http://localhost:3500/api/no2/',
    SO2: 'http://localhost:3500/api/so2/',
    O3: 'http://localhost:3500/api/o3/'
};

const fetchData = async (pollutant, day, year) => {
    const url = `${API_URLS[pollutant]}${day}/${year}`;
    console.log(url);

    return url


};
document.addEventListener('DOMContentLoaded', function () {
    const sideImageContainer = document.getElementById('side-image-container');
    const sideImage = document.getElementById('side-image');

    document.getElementById('ok-button').addEventListener('click', () => {
        console.log("data");

        displayPolygon();
        const container = legendControl.getContainer();
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('correlation-button').addEventListener('click', function () {
        console.log("sss");

        const pollutant = document.getElementById('type-pollutant').value;
        const year = document.getElementById('year').value;

        let imageUrl = '';
        if (pollutant === 'CO' && year === '2020') {
            imageUrl = './co-2020.png';
        } else if (pollutant === 'NO2' && year === '2020') {
            imageUrl = './no2-2020.png';
        } else if (pollutant === 'SO2' && year === '2020') {
            imageUrl = './so2-2020.png';
        } else if (pollutant === 'O3' && year === '2020') {
            imageUrl = './o3-2020.png';
        } else if (pollutant === 'CO' && year === '2021') {
            imageUrl = './co-2021.png';
        } else if (pollutant === 'NO2' && year === '2021') {
            imageUrl = './no2-2021.png';
        } else if (pollutant === 'SO2' && year === '2021') {
            imageUrl = './so2-2021.png';
        } else if (pollutant === 'O3' && year === '2021') {
            imageUrl = './o3-2021.png';
        } else if (pollutant === 'CO' && year === '2022') {
            imageUrl = './co-2022.png';
        } else if (pollutant === 'NO2' && year === '2022') {
            imageUrl = './no2-2022.png';
        } else if (pollutant === 'SO2' && year === '2022') {
            imageUrl = './so2-2022.png';
        } else if (pollutant === 'O3' && year === '2022') {
            imageUrl = './o3-2022.png';
        } else if (pollutant === 'CO' && year === '2023') {
            imageUrl = './co-2023.png';
        } else if (pollutant === 'NO2' && year === '2023') {
            imageUrl = './no2-2023.png';
        } else if (pollutant === 'SO2' && year === '2023') {
            imageUrl = './so2-2023.png';
        } else if (pollutant === 'O3' && year === '2023') {
            imageUrl = './o3-2023.png';
        }

        if (imageUrl) {
            sideImage.src = imageUrl;
            sideImageContainer.style.display = 'block';
        } else {
            console.log('Image URL is missing or incorrect.');
        }
    });
});



// Define color scales for each pollutant
const pollutantColors = {
    CO: ['#fff5f6', '#ffe5e8', '#ffcdd2', '#e57373', '#f44336', '#d32f2f', '#c62828', '#b71c1c', '#891515', '#330202'],
    NO2: ['#4B0082', '#0000FF', '#007FFF', '#00FFFF', '#00FF7F', '#00FF00', '#7FFF00', '#FFFF00', '#FF7F00', '#FF0000'],
    SO2: ['#fff5f6', '#ffe5e8', '#ffcdd2', '#e57373', '#f44336', '#d32f2f', '#c62828', '#b71c1c', '#891515', '#330202'],
    O3: ['#fff5f6', '#ffe5e8', '#ffcdd2', '#e57373', '#f44336', '#d32f2f', '#c62828', '#b71c1c', '#891515', '#330202']
};

// Function to get color for a value based on a scale
const getColorForValue = (value, minValue, maxValue, colorScale) => {
    const numColors = colorScale.length;
    const range = maxValue - minValue;
    const valueRatio = (value - minValue) / range;
    const colorIndex = Math.min(Math.floor(valueRatio * (numColors - 1)), numColors - 1);
    return colorScale[colorIndex];
};

// Function to create color bar with legend
var legendControlInstance = L.control({ position: 'bottomright' });

legendControlInstance.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML = '<h4>Value</h4>' +
        '<div class="high">สูง</div>' +
        '<div class="color-bar"></div>' +
        '<div class="low">ต่ำ</div>';
    return div;
};

var legendControl = legendControlInstance.addTo(map);
legendControl.getContainer().style.display = 'none';

// Clear existing GeoJSON layers
const clearGeoJsonLayers = () => {
    map.eachLayer((layer) => {
        if (layer instanceof L.GeoJSON) {
            map.removeLayer(layer);
        }
    });
};

// Display polygons with data
const displayPolygon = async () => {
    const pollutantSelect = document.getElementById('type-pollutant');
    const daySelect = document.getElementById('day');
    const yearSelect = document.getElementById('year');

    if (!pollutantSelect || !daySelect || !yearSelect) {
        console.error("Dropdowns not found");
        return;
    }

    const pollutant = pollutantSelect.value.toUpperCase();
    const day = daySelect.value;
    const year = yearSelect.value;

    // console.log("Selected Pollutant:", pollutant);
    // console.log("Selected Day:", day);
    // console.log("Selected Year:", year);

    try {
        let url = await fetchData(pollutant, day, year);
        console.log("Fetching URL:", url);
        const dataAPI = await axios.get(url).then(r => {
            console.log(r);

        });



        // console.log("Data API:", dataAPI);

        // if (dataAPI && dataAPI.features && dataAPI.features.length > 0) {
        //     console.log("GeoJSON Data:", dataAPI);

        //     clearGeoJsonLayers();

        //     // Determine min and max values for color scaling
        //     const values = dataAPI.features.map(feature => feature.properties.value);
        //     const minValue = Math.min(...values);
        //     const maxValue = Math.max(...values);

        //     L.geoJSON(dataAPI, {
        //         style: (feature) => {
        //             const value = feature.properties.value;
        //             const colorScale = pollutantColors[pollutant] || ['black'];
        //             return {
        //                 color: getColorForValue(value, minValue, maxValue, colorScale),
        //                 weight: 2,
        //                 opacity: 1
        //             };
        //         },
        //         onEachFeature: (feature, layer) => {
        //             console.log("Feature Properties:", feature.properties);
        //             layer.bindPopup(`
        //                 Pollution: ${feature.properties.param}<br>
        //                 Value (mol/m²): ${feature.properties.value}<br>
        //                 USC: ${feature.properties.usc}
        //             `);
        //         }
        //     }).addTo(map);
        // } else {
        //     console.error("No valid GeoJSON data found in response");
        // }
    } catch (error) {
        console.error("Error processing geometry data:", error);
    }
};




document.getElementById('.sidebar').addEventListener('mouseover', function () {
    document.querySelector('.sidebar').style.width = '200px';
    document.querySelector('.sidebar').style.opacity = '1';
    document.querySelector('.sidebar').style.pointerEvents = 'auto';
    document.getElementById('main').style.marginLeft = '200px'; // เปลี่ยนค่าตามความกว้างของแถบข้าง
});

document.querySelector('.sidebar').addEventListener('mouseleave', function () {
    document.querySelector('.sidebar').style.width = '60px'; // ความกว้างของแถบข้างเมื่อซ่อน
    document.querySelector('.sidebar').style.opacity = '1';
    document.querySelector('.sidebar').style.pointerEvents = 'auto';
    document.getElementById('main').style.marginLeft = '60px'; // ความกว้างของแถบข้างเมื่อซ่อน
});








document.getElementById('about-link').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = 'about.html';
});


document.getElementById('manual').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = 'manual.html';
});

document.getElementById('gee-link').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = 'https://code.earthengine.google.com/fa3567a7147125a77c659cdac23cba96?hideCode=true';
});
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('close-btn').addEventListener('click', function () {
        document.getElementById('side-image-container').style.display = 'none';
    });
});






