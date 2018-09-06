const express = require('express');
const router = express.Router();

const setting = require('../setting');
const cache = require('../helper/cache');
const fetch = require('../helper/fetch');
const {isURL} = require('../helper');
const { getApp } = require('../helper/common');
const {sha1, unique} = require('../helper/crypto');
const getAccessToken = require('../helper/at');

/**
 * get ticket
 */
const getTicket = async(appid) => {
    const app = await getApp(appid);
    if(!app) {
        throw 'invalid_appid';
    }

    const key = `ticket:${appid}`;
    let ticketInfo = cache.get(key);
    if(!ticketInfo) {
        // get access_token
        const accessToken = await getAccessToken(appid);
        // get ticket
        const body = await fetch.get(`${setting.WP.GETTICKET}?access_token=${accessToken}&type=jsapi`);
        const data = body.data;
        if (data.errcode) {
            throw data.errmsg;
        }

        ticketInfo = data.ticket;
        // set into cache
        cache.set(key, ticketInfo, data.expires_in*1000);
    }

    return {
        ticket: ticketInfo,
        appid: app.wx_appid
    };
};


/**
 * 获取jsticket
 */
router.get('', async(req, res, next) => {
    let {appid, url} = req.query;
    if(!appid || !url) {
        return res.failure('invalid params');
    }

    url = decodeURIComponent(url);
    if(!isURL(url)) {
        return res.failure('invalid_url');
    }
    if(url.indexOf('#') !== -1) { // 不允许存在#
        return res.failure('invalid_url');
    }

    try {
        const ticketInfo = await getTicket(appid);
        const nonceStr = unique(16);
        const timestamp = Date.now()/1000;
        const signature = sha1(`jsapi_ticket=${ticketInfo.ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`);
        res.success({
            appId: ticketInfo.appid,
            timestamp,
            nonceStr,
            signature
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
