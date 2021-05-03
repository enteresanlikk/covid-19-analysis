const path = require('path');
const ExcelJS = require('exceljs');
const f = require('./functions');

(async () => {
    const all = require('./json/merged/all');

    const allBook = new ExcelJS.Workbook();

    for (let key of Object.keys(all)) {
        let sheetName = key.replace('*', '').replace('?', '').replace(':', '').replace(':', '').replace('/', '').replace('\/', '').replace('[', '').replace(']', '')
        const allSheet = allBook.addWorksheet(sheetName, { views: [{ state: 'frozen', xSplit: 1, ySplit: 1 }] });

        allSheet.addRow(['Tarih Dönemi', 'Vaka Sayısı', 'Ölümler', 'İyileşenler', 'Test Sayısı']).font = { bold: true };

        let vals = all[key];
        for(let item of vals) {
            allSheet.addRow([item['date'], item['total_cases'], item['new_deaths'], item['saved_count'], item['new_tests']]);
        }
        
        allSheet.columns.forEach(function (column, i) {
            var maxLength = 0;
            column["eachCell"]({ includeEmpty: true }, function (cell) {
                var columnLength = cell.value ? cell.value.toString().length : 20;
                if (columnLength > maxLength ) {
                    maxLength = columnLength;
                }
            });
            column.width = maxLength < 20 ? 20 : maxLength;
        });
    }

    await allBook.xlsx.writeFile(path.join('src', 'export', 'all.xlsx'));
})()