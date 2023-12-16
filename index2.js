// form fieldsconst 
form = document.querySelector('.form-data');
const region = document.querySelector('.region-name');
const apiKey = document.querySelector('.api-key');

// results
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const results = document.querySelector('.result-container');
const usage = document.querySelector('.carbon-usage');
const fossilfuel = document.querySelector('.fossil-fuel');
const myregion = document.querySelector('.my-region');
const clearBtn = document.querySelector('.clear-btn');

form.addEventListener('submit', (e) => handleSubmit(e));
clearBtn.addEventListener('click', (e) => reset(e));
init();

function init() {
    //si hay algo en localStorage, recójalo
    const storedApiKey = localStorage.getItem('apiKey');
    const storedRegion = localStorage.getItem('regionName');
    //establecer el icono en verde genérico//todo
    if (storedApiKey === null || storedRegion === null) {
    //si no tenemos las claves, mostrar el formulario
    form.style.display = 'block';
    results.style.display = 'none';
    loading.style.display = 'none';
    clearBtn.style.display = 'none';
    errors.textContent = '';} else {
    //si  hemos  guardado  claves  /  regiones  en  localStorage, mostrar los resultados cuando se cargan
    displayCarbonUsage(storedApiKey, storedRegion);
    results.style.display = 'none';
    form.style.display = 'none';
    clearBtn.style.display = 'block';
    chrome.runtime.sendMessage({
        action: 'updateIcon',
            value: {color: 'green',},
            } 
        );
    }
};
function reset(e) {
    e.preventDefault();
    //borrar almacenamiento local solo para la región
    localStorage.removeItem('regionName');init();
}

function handleSubmit(e) {
    e.preventDefault();
    setUpUser(apiKey.value, region.value);
}

function setUpUser(apiKey, regionName) {
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('regionName', regionName);
    loading.style.display = 'block';
    errors.textContent = '';
    clearBtn.style.display = 'block';
    //make initial call
    displayCarbonUsage(apiKey, regionName);
}

import axios from '../node_modules/axios';
async function displayCarbonUsage(apiKey, region) {
    try {
        await axios
        .get('https://api.co2signal.com/v1/latest', {
                params: {
                    countryCode: region,
                },
                headers: {
                    'auth-token': apiKey,
                },
            })
            .then((response) => {
                let                   CO2                   = 
                Math.floor(response.data.data.carbonIntensity
                    );
                    //calculateColor(CO2);
                    loading.style.display = 'none';
                    form.style.display = 'none';
                    myregion.textContent = region;
                    usage.textContent =
                    Math.round(response.data.data.carbonIntensity)   +   '   grams (grams C02 emitted per kilowatt hour)';
                    fossilfuel.textContent =response.data.data.fossilFuelPercentage.toFixed(2) +
'%  (percentage  of  fossil  fuels  used  to generate electricity)';results.style.display = 'block';
    })
    ;
} catch (error) {
    console.log(error);
    loading.style.display = 'none';
    results.style.display = 'none';
    errors.textContent  =  'Sorry,  we  have  no  data  for  the region you have requested.';
    }
}

function calculateColor(value) {
    let co2Scale = [0, 150, 600, 750, 800];
    let  colors  =  ['#2AA364',  '#F5EB4D',  '#9E4229',  '#381D02', '#381D02'];
    let closestNum = co2Scale.sort((a, b) => {
        return Math.abs(a -value) -Math.abs(b -value);})[0];
        console.log(value + ' is closest to ' + closestNum);
        let num = (element) => element > closestNum;
        let scaleIndex = co2Scale.findIndex(num);
        let closestColor = colors[scaleIndex];
        console.log(scaleIndex, closestColor);
        chrome.runtime.sendMessage(
            {  action:  'updateIcon',  value:  { color: closestColor } 
        }
    );
}

//let CO2...
calculateColor(CO2);

chrome.runtime.onMessage.addListener(function     (msg,     sender, sendResponse) {
    if (msg.action === 'updateIcon') {
        chrome.browserAction.setIcon(
            {                imageData: drawIcon(msg.value) }
            );
        }
    }
    );
    //tomado de la extensión Energy Lollipop, ¡buena característica!
    function drawIcon(value) {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        context.beginPath();
        context.fillStyle = value.color;
        context.arc(100, 100, 50, 0, 2 * Math.PI);
        context.fill();
        return context.getImageData(50, 50, 100, 100);
    }