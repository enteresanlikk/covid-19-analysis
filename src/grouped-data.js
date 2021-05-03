const fs = require('fs');
const path = require('path');
const f = require('./functions');

const iyilesmeler = require('./json/pure/iyilesme_oranlari');
const vakalar = require('./json/pure/vakalar');

(async () => {
    const vakalarData = f.groupBy(vakalar, 'location');
    await fs.writeFileSync(path.join(__dirname, 'json', 'grouped', 'vakalar.json'), JSON.stringify(vakalarData,null,2));

    const iyilesmelerData = f.groupBy(iyilesmeler, 'Ülke/Kıta');
    await fs.writeFileSync(path.join(__dirname, 'json', 'grouped', 'iyilesme_oranlari.json'), JSON.stringify(iyilesmelerData,null,2));
})()