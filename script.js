let currentExpression = "";
let currentTab = "basic";

// Button definitions
const buttonLayouts = {
    basic: [
        ['7', '8', '9', '/'],
        ['4', '5', '6', '*'],
        ['1', '2', '3', '-'],
        ['.', '0', '=', '+'],
        ['(', ')', '⌫', 'C']
    ],
    scientific: [
        ['sin', 'cos', 'tan', '√'],
        ['π', 'e', 'xʸ', '%'],
        ['(', ')', '⌫', 'C']
    ],
    unit: [
        ['cm → in', 'in → cm', 'kg → lb', 'lb → kg'],
        ['°C → °F', '°F → °C', '⌫', 'C']
    ]
};

// Initialize calculator
function initCalculator() {
    createButtons();
    setupTabs();
    updateDisplay();
    setupKeyboardSupport();
}

// Create buttons for all tabs
function createButtons() {
    for (const tab in buttonLayouts) {
        const container = document.getElementById(`${tab}-buttons`);
        if (!container) continue;
        
        buttonLayouts[tab].forEach(row => {
            row.forEach(label => {
                const button = document.createElement('button');
                button.className = 'button';
                button.textContent = label;
                
                // Assign button classes
                if (['C', '⌫'].includes(label)) {
                    button.classList.add('clear');
                } else if (['=', '%', 'xʸ', 'sin', 'cos', 'tan', '√', 'π', 'e'].includes(label)) {
                    button.classList.add('operator');
                } else if (['cm → in', 'in → cm', 'kg → lb', 'lb → kg', '°C → °F', '°F → °C'].includes(label)) {
                    button.classList.add('unit');
                } else if (label.match(/[0-9.]/)) {
                    button.classList.add('number');
                } else {
                    button.classList.add('operator');
                }
                
                button.addEventListener('click', () => onButtonClick(label));
                container.appendChild(button);
            });
        });
    }
}

// Setup tab switching
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show active content
            const tabName = tab.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabName}-content`).classList.add('active');
            
            currentTab = tabName;
        });
    });
}

// Handle button clicks
function onButtonClick(value) {
    const output = document.getElementById('output');
    
    // Clear button
    if (value === 'C') {
        currentExpression = "";
    }
    // Backspace
    else if (value === '⌫') {
        currentExpression = currentExpression.slice(0, -1);
    }
    // Equals - evaluate expression
    else if (value === '=') {
        try {
            // PERBAIKAN: Ganti ^ menjadi ** dan tangani persen
            let expr = currentExpression.replace(/\^/g, '**').replace(/%/g, '/100');
            currentExpression = eval(expr).toString();
        } catch (e) {
            currentExpression = "Error";
        }
    }
    // Scientific functions
    else if (value === 'sin') {
        try {
            currentExpression = Math.sin(parseFloat(currentExpression) * Math.PI / 180).toString();
        } catch (e) {
            currentExpression = "Error";
        }
    }
    else if (value === 'cos') {
        try {
            currentExpression = Math.cos(parseFloat(currentExpression) * Math.PI / 180).toString();
        } catch (e) {
            currentExpression = "Error";
        }
    }
    else if (value === 'tan') {
        try {
            currentExpression = Math.tan(parseFloat(currentExpression) * Math.PI / 180).toString();
        } catch (e) {
            currentExpression = "Error";
        }
    }
    else if (value === '√') {
        try {
            const num = parseFloat(currentExpression);
            if (num >= 0) {
                currentExpression = Math.sqrt(num).toString();
            } else {
                currentExpression = "Error";
            }
        } catch (e) {
            currentExpression = "Error";
        }
    }
    // Constants
    else if (value === 'π') {
        currentExpression = Math.PI.toString();
    }
    else if (value === 'e') {
        currentExpression = Math.E.toString();
    }
    // Power operator
    else if (value === 'xʸ') {
        currentExpression += '^';
    }
    // Percentage
    else if (value === '%') {
        try {
            currentExpression = (parseFloat(currentExpression) / 100).toString();
        } catch (e) {
            currentExpression = "Error";
        }
    }
    // Unit conversions
    else if (value === 'cm → in') {
        try {
            currentExpression = (parseFloat(currentExpression) / 2.54).toString();
        } catch (e) {
            currentExpression = "Error";
        }
    }
    else if (value === 'in → cm') {
        try {
            currentExpression = (parseFloat(currentExpression) * 2.54).toString();
        } catch (e) {
            currentExpression = "Error";
        }
    }
    else if (value === 'kg → lb') {
        try {
            currentExpression = (parseFloat(currentExpression) * 2.20462).toString();
        } catch (e) {
            currentExpression = "Error";
        }
    }
    else if (value === 'lb → kg') {
        try {
            currentExpression = (parseFloat(currentExpression) / 2.20462).toString();
        } catch (e) {
            currentExpression = "Error";
        }
    }
    else if (value === '°C → °F') {
        try {
            currentExpression = (parseFloat(currentExpression) * 9/5 + 32).toString();
        } catch (e) {
            currentExpression = "Error";
        }
    }
    else if (value === '°F → °C') {
        try {
            currentExpression = ((parseFloat(currentExpression) - 32) * 5/9).toString();
        } catch (e) {
            currentExpression = "Error";
        }
    }
    // Other buttons (numbers, operators)
    else {
        currentExpression += value;
    }
    
    updateDisplay();
}

// Keyboard support
function setupKeyboardSupport() {
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        
        // Mapping keyboard keys to calculator functions
        const keyMap = {
            '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
            '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
            '+': '+', '-': '-', '*': '*', '/': '/', '.': '.',
            '(': '(', ')': ')', '=': '=', 'Enter': '=',
            'Backspace': '⌫', 'Delete': 'C', 'Escape': 'C',
            'r': '√', 'p': 'π', 'e': 'e', '%': '%',
            's': 'sin', 'c': 'cos', 't': 'tan',
            // PERBAIKAN: Tambahkan mapping untuk pangkat
            '**': 'xʸ', 
            '^': 'xʸ'
        };

        // Special case for Enter key on Numpad
        if (event.key === 'Enter' && event.location === 3) {
            onButtonClick('=');
            event.preventDefault();
            return;
        }

        // Handle key press if mapped
        if (keyMap[key]) {
            onButtonClick(keyMap[key]);
            event.preventDefault();
        }
    });
}

// Update display
function updateDisplay() {
    const output = document.getElementById('output');
    if (currentExpression === "") {
        output.value = "0";
    } else {
        output.value = currentExpression;
    }
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', initCalculator);