const path = require('path');
const fs = require('fs-extra');

const {
    DIR_LOGS,
    DIR_SMS,
    DIR_QQ,
    DIR_Wechat,

    DIR_DIY_LOGS,
    DIR_DIY_SMS,
    DIR_DIY_QQ,
    DIR_DIY_Wechat,
} = require('./const');

const getDir = path.join(__dirname, '../../Get/');

module.exports = function () {
    fs.mkdirpSync(DIR_LOGS);
    fs.mkdirpSync(DIR_SMS);

    // 自动复制内容
    // 一般不需要

    // // AndroidBackup
    // copyTarget('/Call_SMS/AndroidBackup/dist/');

    // // calendar_google_com
    // copyTarget('/Call_SMS/calendar_google_com/callLogs/dist/');

    // // i_Mi_com
    // copyTarget('/Call_SMS/i_Mi_com/SMS/dist/');

    // // ic_qq_com;
    // copyTarget('/Call_SMS/ic_qq.com/SMS/dist/');

    // // S60v3_MMS;
    // copyTarget('/Call_SMS/S60v3_MMS/toMsg/dist');

    // // S60v3_SMS_msg.info
    // copyTarget('/Call_SMS/S60v3_SMS_msg.info/distM');
};

function copyTarget(p) {
    const dir = path.join(getDir, p);
    const files = fs.readdirSync(dir);

    for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (fs.statSync(path.join(dir, f)).isDirectory()) continue;

        const { name } = path.parse(f);
        const pre = name.split('_')[0];
        const fileDir = path.join(dir, f);
        let type = '';
        switch (pre) {
            case 'callLogs':
                type = DIR_LOGS;
                break;
            case 'sms':
                type = DIR_SMS;
                break;
            default:
                throw new Error(`unknown Type ${f}`);
        }
        fs.copySync(fileDir, path.join(type, f));
    }
}
