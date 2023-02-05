const dayjs = require('dayjs');

// 这里是人工修正一些错误的 msg

function fixByType(type, arr) {
    let fixArr;
    switch (type) {
        case 'sms':
            fixArr = fixSms(arr);
            break;
        case 'logs':
        case 'qq':
            fixArr = arr;
            break;
        default:
            throw new Error('unknown type', type);
    }
    console.log(type, 'Fix 长度', fixArr.length);
    return fixArr;
}

function fixSms(arr) {
    return arr;
}

module.exports = {
    fixByType,
};
