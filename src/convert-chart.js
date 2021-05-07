const XLSXChart = require("xlsx-chart");
const path = require('path');
const ExcelJS = require('exceljs');

let chartType = 'line';
(async () => {
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.readFile(path.join('src', 'export', "all.xlsx"));

	workbook.eachSheet(function (worksheet, sheetId) {

		let i = 0;
		let titles = ['Vaka Sayısı', 'İyileşenler', 'Test Sayısı'];
		let fields = [];
		let data = {
			'Vaka Sayısı': {},
			'İyileşenler': {},
			'Test Sayısı': {}
		};
		worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
			let values = row.values;
			if(i != 0) {
				fields.push(values[1]);

				data['Vaka Sayısı'] = Object.assign({}, data['Vaka Sayısı'], { [values[1]]: values[2] })

				data['İyileşenler'] = Object.assign({}, data['İyileşenler'], { [values[1]]: values[3] })

				data['Test Sayısı'] = Object.assign({}, data['Test Sayısı'], { [values[1]]: values[4] })
			}

			i++;
		});

		let xlsxChart = new XLSXChart();
		let opts = {
			chart: chartType,
			file: path.join('src', 'charts', (chartType == 'line' ? 'cizgi' : (chartType == 'pie' ? 'pasta' : (chartType == 'column' ? 'sutun' : ''))), worksheet.name+".xlsx"),
			titles,
			fields,
			data,
			chartTitle: worksheet.name
		};

		xlsxChart.writeFile (opts, function (err) {
			console.log ("File: ", opts.file);
		});


	});
})()