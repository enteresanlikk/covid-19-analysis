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

    await fs.writeFileSync(path.join(__dirname, 'json', 'merged', 'all.json'), JSON.stringify(retVal,null,2));
})()