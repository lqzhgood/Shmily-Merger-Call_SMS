const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');

const { DIR_LOGS, DIR_SMS, DIR_QQ, DIR_WECHAT } = require('./const');
const config = require('../config');

function filterHerByType(type, arr) {
    let arr_her;
    switch (type) {
        case 'logs':
        case 'sms':
            arr_her = arr.filter(
                v =>
                    v.numberIsTrue ||
                    config.herName.find(n => v.senderName.replace(/\s/g, '').includes(n)) ||
                    config.herName.find(n => v.receiverName.replace(/\s/g, '').includes(n)) ||
                    config.herId.find(n => v.sender.replace(/\s/g, '').includes(n)) ||
                    config.herId.find(n => v.receiver.replace(/\s/g, '').includes(n)),
            );
            break;
        case 'qq':
        case 'wechat':
            throw new Error('QQ Wechat 你应该只导入一个人而不是全部啊');
        default:
            throw new Error('unknown type', type);
    }
    console.log(type, `her 长度`, arr_her.length);
    return arr_her;
}

function readAndMergerByType(type) {
    const dir = typeDir(type);
    const list = fs.readdirSync(dir);
    const arr = list.reduce((pre, file) => {
        const json = require(path.join(dir, file));
        return pre.concat(json);
    }, []);
    console.log(`${type} 总长度`, arr.length);
    return arr;
}

function typeDir(type) {
    switch (type) {
        case 'logs':
            return DIR_LOGS;
        case 'sms':
            return DIR_SMS;
        case 'qq':
            return DIR_QQ;
        case 'wechat':
            return DIR_WECHAT;
        default:
            throw new Error('unknown type', type);
    }
}

function makeUniq(type, arr) {
    const uniqFin = removeUniqSelectName(type, _.cloneDeep(arr));
    const uniqOnlyCheck = removeUniq(type, _.cloneDeep(arr));

    if (uniqFin.length !== uniqOnlyCheck.length) throw new Error('校验不通过 部分通话记录name未记录');
    console.log(type, '去重校验正确 总长度', uniqFin.length);
    return uniqFin;
}

/**
 * @name: 数组选择性去重
 * @description:  如果两者一样 那么保留含 name 属性的
 * @param {type}
 * @return {type}
 */
function removeUniqSelectName(type, arr) {
    arr.forEach((v, i) => {
        if (!v) return;
        const oS = makeUniqString(type, v);
        const index = arr.findIndex((nV, nI) => {
            if (i === nI || !nV) return false;
            return makeUniqString(type, nV) === oS;
        });
        if (index === -1) return;
        const nV = arr[index];
        // i 是当前的  index 是当前遍历的
        if (!noName(v.name) && !noName(nV.name)) {
            if (v.name == nV.name) arr[i] = undefined;
            else throw new Error('same name', v, nV);
        } else if (!noName(v.name) && noName(nV.name)) arr[index] = undefined;
        else if (noName(v.name) && !noName(nV.name)) arr[i] = undefined;
        else if (noName(v.name) && noName(nV.name)) {
            if (empty(v.name) && empty(nV.name)) arr[i] = undefined;
            else if (empty(v.name) && hcName(nV.name)) arr[i] = undefined;
            else if (hcName(v.name) && empty(nV.name)) arr[index] = undefined;
            else if (hcName(v.name) && hcName(nV.name)) arr[i] = undefined;
            else throw new Error('same noName', v, nV);
        } else {
            throw new Error('that all');
        }
    });
    return arr.filter(v => v);

    function noName(name) {
        // _为硬编码写入 视作为空
        return empty(name) || hcName(name);
    }

    function empty(name) {
        return name ? !name.trim() : name;
    }
    function hcName(name) {
        return name ? name.startsWith('_') : name;
    }
}

/**
 * @name:
 * @description: 校验用 这个是直接去重，不管 name。如果数量和 removeUniq 一致的话校验通过
 * @param {type}
 * @return {type}
 */
function removeUniq(type, arr) {
    return _.uniqWith(arr, (a, b) => {
        const aS = makeUniqString(type, a);
        const bS = makeUniqString(type, b);
        return aS === bS;
    });
}

function makeUniqString(type, v) {
    const str = `${v.source}-${v.device}-${v.type}-${v.direction}
    -${v.day}-${v.time}
    -${v.content}-${v.html}`;
    const num = v.direction === 'come' ? v.sender : v.receiver;
    switch (type) {
        case 'logs':
            // 包含非精确ID合并  使用 ${v.$CallLog.data.duration} 代替  ${v.ms}
            return `${str}-${v.$CallLog.data.duration}-${num}`;
        case 'sms':
            return `${str}-${v.ms}-${num}`;
        default:
            throw new Error('unknown type', type);
    }
}

function sortArr(arr) {
    return _.sortBy(arr, 'ms');
}

module.exports = {
    filterHerByType,
    readAndMergerByType,
    makeUniq,
    sortArr,
};
