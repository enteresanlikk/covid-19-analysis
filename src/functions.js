module.exports.getColor = (month) => {
    switch(+month) {
        case 1:
            return '33658A';
        case 2:
            return 'F6AE2D';
        case 3:
            return '009FB7';
        case 4:
            return 'FE4A49';
        case 5:
            return 'FED766';
        case 6:
            return 'F26419';
        case 7:
            return 'E6E6EA';
        case 8:
            return '86BBD8';
        case 9:
            return 'FFA987';
        case 10:
            return '034C3C';
        case 11:
            return '73C2BE';
        case 12:
            return '2F4858';
    }
}

module.exports.getMaxKeys = (list) => {
    const newList = [];
    for(let i in list) {
        newList.push([i, Object.keys(list[i]).length]);
    }

    aa = newList.sort((a,b)=> (a[1] < b[1] ? 1 : -1))

    return aa[0];
};

module.exports.toDateStr = (month) => {
    switch(+month) {
        case 1:
            return 'Ocak';
        case 2:
            return 'Şubat';
        case 3:
            return 'Mart';
        case 4:
            return 'Nisan';
        case 5:
            return 'Mayıs';
        case 6:
            return 'Haziran';
        case 7:
            return 'Temmuz';
        case 8:
            return 'Ağustos';
        case 9:
            return 'Eylül';
        case 10:
            return 'Ekim';
        case 11:
            return 'Kasım';
        case 12:
            return 'Aralık';
    }
};

module.exports.toplasana = (list, month, year) => {
    let keys = Object.keys(list).filter(e=> {
        let splitted = e.split('/');
        return splitted[0] == month && splitted[2] == year;
    });

    let t = 0;
    keys.map(e=> {
        t += (+list[e]);
    });

    return t;
}

module.exports.groupBy = (list, groupKey) => {
    var objectWithGroupByName = {};
    for (var key in list) {
        var name = list[key][groupKey];
        if (!objectWithGroupByName[name]) {
            objectWithGroupByName[name] = [];
        }
        objectWithGroupByName[name].push(list[key]);
    }

    return objectWithGroupByName;
}