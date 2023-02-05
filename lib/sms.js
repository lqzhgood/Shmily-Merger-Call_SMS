const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');

const { OUTPUT_DIR, DIR_DIY_SMS } = require('./const');
const { readAndMergerByType, filterHerByType, makeUniq, sortArr } = require('./utils');

const { fixByType } = require('../input_diy/fix');

const TYPE = 'sms';

module.exports = function () {
    const arr = readAndMergerByType(TYPE);
    const uniq = makeUniq(TYPE, arr);

    // 这里的跳过合并处理  此处 ic_qq_com 仅为示例
    // const ic_qq_com = require(path.join(DIR_DIY_SMS, './sms_ic_qq.com.json'));
    // const uniq_merger = uniq.concat(ic_qq_com);

    const uniq_merger = uniq.concat([]);

    const her = filterHerByType(TYPE, uniq_merger);
    const fix = fixByType(TYPE, her);

    const sort = sortArr(fix);
    const clear = deleteSameMsAndContent(sort);

    fs.writeFileSync(path.join(OUTPUT_DIR, './sms.json'), JSON.stringify(clear, null, 4));
};

function deleteSameMsAndContent(arr) {
    for (let i = 1; i < arr.length; i++) {
        const a = arr[i];
        const b = arr[i - 1];

        const keys = _.uniq([].concat(Object.keys(a), Object.keys(b)));
        if (keys.includes(undefined)) console.log('keys', keys, a, b);
        const n = _.cloneDeep(a);

        if (a.ms === b.ms && a.html == b.html) {
            let deleteLast = 1;

            for (let j = 0; j < keys.length; j++) {
                const k = keys[j];

                switch (k) {
                    case 'source':
                    case 'msAccuracy':
                    case 'numberIsTrue':
                    case 'html':
                    case 'day':
                    case 'time':
                    case 'ms':
                        // 不在乎的属性
                        break;
                    case 'device':
                        if (!_.isEqual(a.device, b.device)) {
                            if (a.device !== 'Phone') n.device = a.device;
                            else if (b.device !== 'Phone') n.device = b.device;
                            else {
                                deleteLast = true;
                                console.log('device 不一致', a, b);
                            }
                        }
                        break;
                    case 'type':
                        if (!_.isEqual(a.type, b.type)) {
                            deleteLast = true;
                            console.log('type 不一致', a, b);
                        }
                        break;
                    case 'direction':
                        if (!_.isEqual(a.direction, b.direction)) {
                            deleteLast = true;
                            console.log('direction 不一致', a, b);
                        }
                        break;
                    case 'sender':
                        if (!_.isEqual(a.sender, b.sender)) {
                            deleteLast = true;
                            console.log('sender 不一致', a, b);
                        }
                        break;
                    case 'senderName':
                        if (!_.isEqual(a.senderName.replace(/\s/g, ''), b.senderName.replace(/\s/g, ''))) {
                            if (!/^1\d{10}$/.test(a.senderName)) n.senderName = a.senderName;
                            else if (!/^1\d{10}$/.test(b.senderName)) n.senderName = b.senderName;
                            else {
                                deleteLast = true;
                                console.log('senderName 不一致', a.senderName, b.senderName);
                            }
                        }
                        break;
                    case 'receiver':
                        if (!_.isEqual(a.receiver, b.receiver)) {
                            deleteLast = true;
                            console.log('receiver 不一致', a, b);
                        }
                        break;
                    case 'receiverName':
                        if (!_.isEqual(a.receiverName.replace(/\s/g, ''), b.receiverName.replace(/\s/g, ''))) {
                            if (!/^1\d{10}$/.test(a.receiverName)) n.receiverName = a.receiverName;
                            else if (!/^1\d{10}$/.test(b.receiverName)) n.receiverName = b.receiverName;
                            else {
                                deleteLast = true;
                                console.log('receiverName 不一致', a.receiverName, b.receiverName);
                            }
                        }
                        break;
                    case 'content':
                        if (!_.isEqual(a.content, b.content)) {
                            deleteLast = true;
                            console.log('content 不一致', a, b);
                        }
                        break;
                    case '$SMS':
                        if (!_.isEqual(a.$SMS, b.$SMS)) {
                            deleteLast = true;
                            console.log('$SMS 不一致', a, b);
                        }
                        break;
                    default:
                        deleteLast = true;
                        console.log('未知属性', k);
                        break;
                }
            }
            arr[i] = n;
            if (deleteLast) arr[i - 1] = undefined;
        }
    }
    return arr.filter(v => v);
}
