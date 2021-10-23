function saveFile(content) {
    if(!content) {
        console.error('Console.save: No data');
        return;
    }

    let filename = 'console.json';

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4);
    }

    let blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a');

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
}

let table = document.getElementsByClassName('holdings-table')[0];
let header = table.querySelector('thead');
let mapHeader = new Map();
let data = [];

header.querySelectorAll('tr th').forEach((a, i) => {
  let span = a.querySelector('span.sorting-link');
  if (span) {
    mapHeader.set(i, span.innerText.trim());
  } else {
   if (a.innerText === 'Anteile') {
    mapHeader.set(i, a.innerText.trim());
   } 
  }
});
let dataRows = table.querySelectorAll('tbody tr');
dataRows.forEach((row, i) => {
  let obj = {};
  obj.stock = {};
  row.querySelectorAll('td').forEach((col, t) => {
    if (!mapHeader.has(t)) {
      return;
    }
    if (mapHeader.get(t).toUpperCase() === 'Wertpapier'.toUpperCase()) {
      obj.stock.name = col.querySelector('strong').innerText;
      let meta = col.querySelectorAll('small span');
      obj.stock.isin = meta[0].innerText;
      obj.stock.wkn = meta[1].innerText;
      obj.stock.type = meta[2].innerText;
    } else if (mapHeader.get(t).toUpperCase() === 'Einstieg'.toUpperCase()) {
      let prices = col.querySelectorAll('span');
      obj.currentValue = parseFloat(prices[0].innerText.replace('.', '').replace(',', '.')); 
      obj.currentQuote = parseFloat(prices[1].innerText.replace('.', '').replace(',', '.')); 
    } else if (mapHeader.get(t).toUpperCase() === 'Anteile'.toUpperCase()) {
      obj.quantity = parseFloat(col.innerText.replace('.', '').replace(',', '.'));
    }
  });
  data.push(obj);
});
saveFile(data);
