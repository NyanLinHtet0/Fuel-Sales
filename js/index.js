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

fetch('/assets/fuel_sales.json')
.then(res => res.json())
.then(all => {
  // filter to March entries
  const march = all.filter(d => d.date.startsWith('2025-03'));
  if (!march.length) return;
  // take first day (2025-03-01)
  render(march[0].sales);
});

function render(sales) {
const tbody = document.querySelector('#sales-table tbody');
const fuels = ['n_two','n_five','premium','diesel'];
const counts = fuels.map(f => sales[f].length);
const maxId = Math.max(...counts);

function fmt(x){return (+x).toFixed(2)}
function recalcTotal() {
  let sum=0;
  document.querySelectorAll('.amt-cell').forEach(td=> sum+=parseFloat(td.textContent)||0);
  document.getElementById('grand-total').textContent=fmt(sum);
}

for(let id=1; id<=maxId; id++){
  const tr=document.createElement('tr');
  tr.innerHTML = `<td>${id}</td>`;
  fuels.forEach(f=>{
    const entry = sales[f].find(e=>e.id===id)||{liters:0,price:0};
    tr.innerHTML +=
      `<td><input type="number" step="0.001" class="lit" value="${entry.liters}"></td>`+
      `<td><input type="number" step="0.01" class="prc" value="${entry.price}"></td>`+
      `<td class="amt-cell">0</td>`;
  });
  tbody.appendChild(tr);
}

document.querySelectorAll('input').forEach(inp=>
  inp.addEventListener('input',()=>{
    document.querySelectorAll('tr').forEach(row=>{
      const lits = Array.from(row.querySelectorAll('.lit')).map(i=>parseFloat(i.value)||0);
      const prcs = Array.from(row.querySelectorAll('.prc')).map(i=>parseFloat(i.value)||0);
      const amts = lits.map((l,i)=>l*prcs[i]);
      row.querySelectorAll('.amt-cell').forEach((td,i)=> td.textContent=fmt(amts[i]));
    });
    recalcTotal();
  })
);
// initial calc
document.querySelectorAll('input')[0].dispatchEvent(new Event('input'));
}