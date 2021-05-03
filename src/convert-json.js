const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const path = require('path');

const result = excelToJson({
    sourceFile: path.join(__dirname, 'inputs','veriler.xlsx'),
    header:{
        rows: 1
    },
    sheets:[{
        name: 'vakalar',
        columnToKey: {
            '*': '{{columnHeader}}'
        }
    },{
        name: 'iyilesme_oranlari',
        columnToKey: {
            '*': '{{columnHeader}}'
        }
    }]
});

const vakalar = JSON.stringify(result['vakalar'],null,2);
const iyilesmeler = JSON.stringify(result['iyilesme_oranlari'],null,2);

fs.writeFileSync(path.join(__dirname, 'json', 'pure', 'vakalar.json'), vakalar);
fs.writeFileSync(path.join(__dirname, 'json', 'pure', 'iyilesme_oranlari.json'), iyilesmeler);