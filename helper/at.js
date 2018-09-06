const fetch = require('./fetch');
const setting = require('../setting');
const cache = require('../helper/cache');
const { getApp } = require('../helper/common');

/**
 * 获取access_token
 */
module.exports = async function(appid) {
    const app = await getApp(appid);
    if(!app) {
        throw 'invalid_appid';
    }

    const key = `token:${appid}`;
    let tokenInfo = cache.get(key);
    if(!tokenInfo) {
        // 重新获取access_token
        const body = await fetch.get(`${setting.WP.TOKEN}?grant_type=client_credential&appid=${app.wx_appid}&secret=${app.wx_appsecret}`);
        const data = body.data;
        if (data.errcode) {
            throw data.errmsg;
        }
        tokenInfo = data.access_token;
        // set into cache
        cache.set(key, tokenInfo, data.expires_in*1000);
    }

    return tokenInfo;

};
