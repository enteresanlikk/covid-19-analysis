const fs = require('fs');
const path = require('path');
const f = require('./functions');

const iyilesmeler = require('./json/grouped/iyilesme_oranlari');
const vakalar = require('./json/grouped/vakalar');

(async () => {
    const vakaArr = {};
    for(let vakaKey of Object.keys(vakalar)) {
        let vakas = vakalar[vakaKey];

        let tmp = [];
        for(let vaka of vakas) {
            let date = vaka.date+'';
            let splitted = date.split('-');
            let obj = {
                date,
                month: +splitted[1],
                year: +splitted[0],

                location: vaka.location,

                total_cases: vaka.new_cases || 0,
                new_deaths: vaka.new_deaths || 0,
                new_tests: vaka.new_tests || 0
            };

            tmp.push(obj);
        }

        vakaArr[vakaKey] = tmp;
    }

    const newVakaArr = {};
    for(let itemsKey of Object.keys(vakaArr)) {
        let items = vakaArr[itemsKey];

        let monthsTmp1 = {};
        for(let item of items) {
            let date = item.date+'';
            let splitted = date.split('-');

            let dateKey = f.toDateStr(+splitted[1]) + ' ' + +splitted[0];

            if(!monthsTmp1[dateKey]) {
                monthsTmp1[dateKey] = [];
            }

            monthsTmp1[dateKey].push({
                date: item.date,
                total_cases: item.total_cases || 0,
                new_tests: item.new_tests || 0,
            });
        }

        let monthsTmp2 = [];
        for(let item of Object.keys(monthsTmp1)) {
            let items = monthsTmp1[item];

            let total_cases = 0;
            let new_tests = 0;
            for(let a of items) {
                total_cases += a.total_cases;
                new_tests += a.new_tests;
            }
            monthsTmp2.push({
                date: item,
                total_cases: total_cases,
                new_tests: new_tests
            });
        }

        newVakaArr[itemsKey] = monthsTmp2;
    }

    await fs.writeFileSync(path.join(__dirname, 'json', 'process', 'vakalar.json'), JSON.stringify(newVakaArr,null,2));
})();

(async () => {
    //iyilesmeler
    const iyiArr = {};
    for (let key of Object.keys(iyilesmeler)) {
        let items = iyilesmeler[key];

        let newObj = {};
        for(let item of items) {
            delete item['Ülke/Kıta'];
            newObj = Object.assign({}, newObj, item)
        }
        
        iyiArr[key] = newObj
    }


    const retArr = {};
    for (let key of Object.keys(iyiArr)) {
        let items = iyiArr[key];

        let newList = [];
        let keys = Object.keys(items);
        for(let a of keys) {
            let date = a+'';
            let splitted = date.split('/');

            let obj = {
                month: +splitted[0],
                year: +splitted[2],
                value: items[a]
            };

            newList.push(obj);
        }
        
        let abc = [];
        let j = 0;
        for(let i=1; i<newList.length; i++) {
            let prevItem = newList[j];
            let nextItem = newList[i];
            
            abc.push({
                ...nextItem,
                value: Math.abs(nextItem.value - prevItem.value)
            });

            j++;
        }
        
        let year_grouped = abc.reduce((r, a) => { r[a.year] = [...r[a.year] || [], a]; return r; }, {});

        abc = {};
        for(let year of Object.keys(year_grouped)) {
            let month_grouped = year_grouped[year].reduce((r, a) => { r[a.month] = [...r[a.month] || [], a]; return r; }, {});

            abc[year] = month_grouped;
        }

        let retList = {};
        for(let a of Object.keys(abc)) {
            for(let y of Object.keys(abc[a])) {
                let t = 0;
                for(let m of abc[a][y]) {
                    t += m.value;
                }

                retList[f.toDateStr(y) + ' 20' + a] = t;
            }
        }

        retArr[key] = retList;
    }

    await fs.writeFileSync(path.join(__dirname, 'json', 'process', 'iyilesme_oranlari.json'), JSON.stringify(retArr,null,2));
})()