const fs = require('fs-extra');
const path = require('path');

const { OUTPUT_DIR } = require('./const');
const { readAndMergerByType, filterHerByType, makeUniq, sortArr } = require('./utils');


module.exports = function () {


    const logs = readAndMergerByType('logs');
    const logs_uniq = makeUniq('logs', logs);
    const logs_her = filterHerByType('logs', logs_uniq);

    const logs_sort = sortArr(logs_her);

    fs.writeFileSync(
        path.join(OUTPUT_DIR, './logs.json'),
        JSON.stringify(logs_sort, null, 4),
    );
};