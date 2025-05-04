/* -----------------------------------Caluclator Area Start------------------------------------ */
const fuels = [
    { key: '92', name: 'Fuel 92' },
    { key: '95', name: 'Fuel 95' },
    { key: 'premium', name: 'Premium Diesel' },
    { key: 'diesel', name: 'Diesel' },
];

function formatWithCommas(str) {
    const [intPart, decPart] = str.split('.');
    const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decPart !== undefined ? withCommas + '.' + decPart : withCommas;
}

const grid = document.querySelector('.fuel-grid');

fuels.forEach(fuel => {
    // Fuel label
    const label = document.createElement('div');
    label.textContent = fuel.name;
    grid.appendChild(label);

    // Liters input (text so we can format)
    const inpL = document.createElement('input');
    inpL.type = 'text';
    inpL.id = `amt-${fuel.key}`;
    inpL.placeholder = '0.00';
    grid.appendChild(inpL);

    // Price input
    const inpP = document.createElement('input');
    inpP.type = 'text';
    inpP.id = `price-${fuel.key}`;
    inpP.placeholder = '0';
    grid.appendChild(inpP);

    // Subtotal div
    const subDiv = document.createElement('div');
    subDiv.className = 'subtotal';
    subDiv.id = `sub-${fuel.key}`;
    subDiv.textContent = '0';
    grid.appendChild(subDiv);

    // formatting + recalc on input
    [inpL, inpP].forEach(inp => {
        inp.addEventListener('input', e => {
        let v = e.target.value.replace(/,/g, '');
        // allow digits and optional decimal
        if (/^\d*\.?\d*$/.test(v)) {
            // for price (no decimals) strip decimals portion
            if (e.target === inpP) {
            v = v.split('.')[0];
            }
            e.target.value = v ? formatWithCommas(v) : '';
        }
        calculate();
        });
    });
});

function calculate() {
    let totalL = 0, totalMoney = 0;
    fuels.forEach(fuel => {
        const rawAmt = document.getElementById(`amt-${fuel.key}`).value.replace(/,/g,'');
        const rawPrice = document.getElementById(`price-${fuel.key}`).value.replace(/,/g,'');
        const amt = parseFloat(rawAmt) || 0;
        const price = parseFloat(rawPrice) || 0;
        const sub = amt * price;
        document.getElementById(`sub-${fuel.key}`).textContent = formatWithCommas(sub.toFixed(0));
        totalL += amt;
        totalMoney += sub;
    });
    // totals with grouping
    document.getElementById('total-liters').textContent =
        formatWithCommas(totalL.toFixed(2));
    document.getElementById('total-money').textContent =
        formatWithCommas(totalMoney.toFixed(0));
}

document.querySelectorAll('input')[0].dispatchEvent(new Event('input'));
/* -----------------------------------Caluclator Area End------------------------------------ */

// To limit the month input from 1-12
const input = document.getElementById('monthInput');
input.addEventListener('input', () => {
  const value = parseInt(input.value, 10);
  if (value < 1 || value > 12) {
    input.setCustomValidity("Value must be between 1 and 12");
  } else {
    input.setCustomValidity(""); // valid
  }
});

// Adding a row to the table
const table_data = []


// to format number
document.querySelectorAll('.rev_cell').forEach(cell => {
    const raw = cell.textContent.replace(/,/g, ''); // just in case
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      cell.textContent = num.toLocaleString('en-US'); // "1,234,567"
    }
});


