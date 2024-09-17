document.getElementById('convertButton').addEventListener('click', () => {
    convertUnits();
});

document.getElementById('inputValue').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        convertUnits();
    }
});

function convertUnits() {
    const inputValue = document.getElementById('inputValue').value;
    const inputUnit = document.getElementById('inputUnit').value;
    const outputUnit = document.getElementById('outputUnit').value;

    const currentPage = window.location.pathname;

    if (currentPage.includes('longueur')) {
        const result = convertLength(parseFloat(inputValue), inputUnit, outputUnit);
        displayResult(result);
    } else if (currentPage.includes('masse')) {
        const result = convertMass(parseFloat(inputValue), inputUnit, outputUnit);
        displayResult(result);
    }
}

function convertLength(value, fromUnit, toUnit) {
    const units = {
        "mètres": 1,
        "kilomètres": 1e-3,
        "centimètres": 1e2,
        "millimètres": 1e3,
        "micromètres": 1e6
    };
    
    if (isNaN(value) || value === '') return '';

    let meters = value * units[fromUnit];
    let result = meters / units[toUnit];

    return result % 1 === 0 ? result.toFixed(0) : result.toFixed(6).replace(/\.?0+$/, '');
}

function convertMass(value, fromUnit, toUnit) {
    const units = {
        "grammes": 1,
        "kilogrammes": 1e-3,
        "milligrammes": 1e3,
        "microgrammes": 1e6
    };
    
    if (isNaN(value) || value === '') return '';

    let grams = value * units[fromUnit];
    let result = grams / units[toUnit];

    return result % 1 === 0 ? result.toFixed(0) : result.toFixed(6).replace(/\.?0+$/, '');
}

function displayResult(result) {
    document.getElementById('result').textContent = result;
}


document.addEventListener('keydown', function(event) {
    if (event.getModifierState('NumLock')) {
        if (event.code === 'NumpadAdd') { // '+' pavé numérique
            zoomIn();
        } else if (event.code === 'NumpadSubtract') { // '-' pavé numérique
            zoomOut();
        }
    }
});

function zoomIn() {
    let currentZoom = document.body.style.zoom || 1;
    currentZoom = parseFloat(currentZoom);
    document.body.style.zoom = (currentZoom + 0.1).toFixed(1);
}

function zoomOut() {
    let currentZoom = document.body.style.zoom || 1;
    currentZoom = parseFloat(currentZoom);
    document.body.style.zoom = (currentZoom - 0.1).toFixed(1);
}