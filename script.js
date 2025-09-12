document.addEventListener('DOMContentLoaded', function () {
    // --- JavaScript Task: Calculator Logic ---
    const shapeRadios = document.querySelectorAll('input[name="shape"]');
    const inputGroup1 = document.getElementById('input-group-1');
    const inputGroup2 = document.getElementById('input-group-2');
    const label1 = document.getElementById('label1');
    const label2 = document.getElementById('label2');
    const param1Input = document.getElementById('param1');
    const param2Input = document.getElementById('param2');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text');
    const svgCanvas = document.getElementById('shape-preview');

    function drawShape(shape, val1, val2) {
        svgCanvas.innerHTML = ''; // Clear previous drawing
        const svgNS = "http://www.w3.org/2000/svg";
        const canvasSize = 250;
        const padding = 20;
        const drawingArea = canvasSize - (2 * padding);

        if (shape === 'rectangle') {
            const rect = document.createElementNS(svgNS, 'rect');
            let width = val1;
            let height = val2;
            const ratio = width / height;

            if (width > height) {
                width = drawingArea;
                height = width / ratio;
            } else {
                height = drawingArea;
                width = height * ratio;
            }

            rect.setAttribute('x', (canvasSize - width) / 2);
            rect.setAttribute('y', (canvasSize - height) / 2);
            rect.setAttribute('width', width);
            rect.setAttribute('height', height);
            rect.setAttribute('fill', '#FDCEDF');
            svgCanvas.appendChild(rect);

        } else if (shape === 'triangle') {
            const polygon = document.createElementNS(svgNS, 'polygon');
            const base = drawingArea;
            let height = (val2 / val1) * base; // Maintain aspect ratio
            height = Math.min(height, drawingArea); // Ensure it doesn't overflow
            
            const x1 = (canvasSize - base) / 2;
            const y1 = (canvasSize + height) / 2;
            const x2 = (canvasSize + base) / 2;
            const y2 = y1;
            const x3 = canvasSize / 2;
            const y3 = (canvasSize - height) / 2;

            polygon.setAttribute('points', `${x1},${y1} ${x2},${y2} ${x3},${y3}`);
            polygon.setAttribute('fill', '#FDCEDF');
            svgCanvas.appendChild(polygon);

        } else if (shape === 'circle') {
            const circle = document.createElementNS(svgNS, 'circle');
            
            // Logika baru untuk membuat radius dinamis
            // Kita tentukan radius input 'standar' (misal 100) yang akan mengisi kanvas.
            const standardInputRadius = 100; 
            const maxVisualRadius = drawingArea / 2;

            // Hitung radius visual berdasarkan input pengguna, diskalakan relatif terhadap standar kita.
            let visualRadius = (val1 / standardInputRadius) * maxVisualRadius;
            
            // Pastikan lingkaran tidak digambar lebih besar dari kanvas.
            visualRadius = Math.min(visualRadius, maxVisualRadius);

            circle.setAttribute('cx', canvasSize / 2);
            circle.setAttribute('cy', canvasSize / 2);
            circle.setAttribute('r', visualRadius);
            circle.setAttribute('fill', '#FDCEDF');
            svgCanvas.appendChild(circle);
        }
    }

    function updateCalculatorUI() {
        const selectedShape = document.querySelector('input[name="shape"]:checked').value;
        param1Input.value = '';
        param2Input.value = '';
        
        if (window.innerWidth < 768) {
            resultContainer.classList.add('hidden');
        }

        if (selectedShape === 'rectangle') {
            inputGroup1.classList.remove('hidden');
            inputGroup2.classList.remove('hidden');
            label1.textContent = 'Length';
            label2.textContent = 'Width';
            param1Input.placeholder = 'Enter length';
            param2Input.placeholder = 'Enter width';
        } else if (selectedShape === 'triangle') {
            inputGroup1.classList.remove('hidden');
            inputGroup2.classList.remove('hidden');
            label1.textContent = 'Base';
            label2.textContent = 'Height';
            param1Input.placeholder = 'Enter base';
            param2Input.placeholder = 'Enter height';
        } else if (selectedShape === 'circle') {
            inputGroup1.classList.remove('hidden');
            inputGroup2.classList.add('hidden');
            label1.textContent = 'Radius';
            param1Input.placeholder = 'Enter radius';
        }
    }

    shapeRadios.forEach(radio => {
        radio.addEventListener('change', updateCalculatorUI);
    });

    calculateBtn.addEventListener('click', () => {
        const selectedShape = document.querySelector('input[name="shape"]:checked').value;
        const val1 = parseFloat(param1Input.value);
        const val2 = parseFloat(param2Input.value);
        let area = 0;
        let calculationString = '';
        let isValid = true;

        if (selectedShape === 'rectangle') {
            if (isNaN(val1) || isNaN(val2) || val1 <= 0 || val2 <= 0) {
                alert('Please enter valid values for length and width.');
                isValid = false;
            } else {
                area = val1 * val2;
                calculationString = `${val1} * ${val2}`;
            }
        } else if (selectedShape === 'triangle') {
            if (isNaN(val1) || isNaN(val2) || val1 <= 0 || val2 <= 0) {
                alert('Please enter valid values for base and height.');
                isValid = false;
            } else {
                area = 0.5 * val1 * val2;
                calculationString = `0.5 * ${val1} * ${val2}`;
            }
        } else if (selectedShape === 'circle') {
            if (isNaN(val1) || val1 <= 0) {
                alert('Please enter a valid value for the radius.');
                isValid = false;
            } else {
                area = Math.PI * Math.pow(val1, 2);
                calculationString = `π * ${val1}²`;
            }
        }
        
        if (isValid) {
            resultText.innerHTML = `Area: <strong>${area.toFixed(2)}</strong> <br><span class="text-sm text-gray-500">(${calculationString})</span>`;
            resultContainer.classList.remove('hidden');
            drawShape(selectedShape, val1, val2);
        }
    });

    // Initialize calculator UI on load
    updateCalculatorUI();
});

