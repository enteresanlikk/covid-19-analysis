const fs = require('fs');
const path = require('path');
const f = require('./functions');

const iyilesmeler = require('./json/process/iyilesme_oranlari');
const vakalar = require('./json/process/vakalar');

const abc = (list, date) => {
    try {
        let retVal = 0;
        for(let i in list) {
            if(i.date == date) {
                retVal = i.total;
                return;
            }
        }

        return retVal;
    } catch(e) {
        return 0;
    }
}

(async () => {

    let retVal = {};
    for(let key of Object.keys(vakalar)) {
        let items = vakalar[key];

        let values = [];
        for(let item of items) {

            let i = 0;
            if(iyilesmeler[key]) {
                if(iyilesmeler[key][item.date]) {
                    i = iyilesmeler[key][item.date];
                }
            }

            values.push({
                ...item,
                saved_count: i || 0
            })
        }

        retVal[key] = values;
    }

    let abc = {};
    for(let key of Object.keys(retVal)) {
        let items = retVal[key];
        
        let total_cases = 0;
        let new_tests = 0;
        let saved_count = 0;

        for(let item of items) {
            total_cases += item['total_cases'];
            new_tests += item['new_tests'];
            saved_count += item['saved_count'];
        }

        abc[key] = {
            recovery_case_rate: +(saved_count / total_cases),
            case_test_rate: +(total_cases / new_tests)
        };
    }

    let newObj = {};
    for(let key of Object.keys(retVal)) {
        newObj[key] = {
            data: retVal[key],
            ...abc[key]
        };
    }

    await fs.writeFileSync(path.join(__dirname, 'json', 'merged', 'all.json'), JSON.stringify(newObj,null,2));
})()