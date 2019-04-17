function download_csv(csv, filename) {
  var csvFile;
  var downloadLink;
  csvFile = new Blob([csv], {
    type: "text/csv"
  });
  downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
}

domains = document.querySelector('.pricing-table tbody').rows
var csv = [];
for (var i = 1; i < domains.length; i++) {
  var row = [];
  row.push(domains[i].cells[0].textContent.trim().split('\n')[0])
  for (var j = 1; j < 5; j++) {
    row_data = domains[i].cells[j].textContent.trim().split('\n')[0].split('Rs')[1];
    if (typeof row_data !== 'undefined')
      row_data = row_data.replace(/,/g, '');
    row.push(row_data);
  }
  csv.push(row.join(","));
}

// Download CSV
download_csv(csv.join("\n"), 'prices.csv');
