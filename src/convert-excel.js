const path = require('path');
const ExcelJS = require('exceljs');
const f = require('./functions');

(async () => {
    const all = require('./json/merged/all');

    const allBook = new ExcelJS.Workbook();

    const fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb:'FFFF00'
        }
      };
      const font = {
          bold: true,
          size: 15
      }

    for (let key of Object.keys(all)) {
        let sheetName = key.replace('*', '').replace('?', '').replace(':', '').replace(':', '').replace('/', '').replace('\/', '').replace('[', '').replace(']', '')
        const allSheet = allBook.addWorksheet(sheetName, { views: [{ state: 'frozen', xSplit: 1, ySplit: 1 }] });

        allSheet.addRow(['Tarih Dönemi', 'Vaka Sayısı', 'İyileşenler', 'Test Sayısı', '', 'İyileşme oranı/vaka sayısı', 'Vaka sayısı/test sayısı']).font = { bold: true };

        let vals = all[key]['data'];
        let i = 0;
        for(let item of vals) {
            allSheet.addRow([item['date'], item['total_cases'], item['saved_count'], item['new_tests'], '', (i==0 ? all[key]['recovery_case_rate'] : ''), (i==0 ? all[key]['case_test_rate'] : '') ]);
            i++;
        }

          let f2 = allSheet.getCell('F2');
          let g2 = allSheet.getCell('G2');

          f2.fill = fill;
          g2.fill = fill;
          f2.font = font;
          g2.font = font;

          f2.numFmt = '00%';
          g2.numFmt = '00%';
        
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