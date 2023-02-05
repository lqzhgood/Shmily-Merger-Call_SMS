const path = require('path');




const INPUT_DIR = path.join(__dirname, '../input');
const DIR_LOGS = path.join(INPUT_DIR, './logs/');
const DIR_SMS = path.join(INPUT_DIR, './sms/');
const DIR_QQ = path.join(INPUT_DIR, './qq/');
const DIR_Wechat = path.join(INPUT_DIR, './wechat/');

const INPUT_DIR_DIY = path.join(__dirname, '../input_diy');
const DIR_DIY_LOGS = path.join(INPUT_DIR_DIY, './logs/');
const DIR_DIY_SMS = path.join(INPUT_DIR_DIY, './sms/');
const DIR_DIY_QQ = path.join(INPUT_DIR_DIY, './qq/');
const DIR_DIY_Wechat = path.join(INPUT_DIR_DIY, './wechat/');

const OUTPUT_DIR = path.join(__dirname, '../dist');

module.exports = {
    INPUT_DIR,
    OUTPUT_DIR,
    DIR_LOGS,
    DIR_SMS,
    DIR_QQ,
    DIR_Wechat,

    DIR_DIY_LOGS,
    DIR_DIY_SMS,
    DIR_DIY_QQ,
    DIR_DIY_Wechat,
};
