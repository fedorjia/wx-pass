const express = require('express');
const router = express.Router();
const LRU = require('lru-cache');

// lru-cache
const cache = new LRU({
    max: 500, // size
    maxAge: 10000 // 10 seconds
});

const setting = require('../setting');
const fetch = require('../helper/fetch');
const { getApp } = require('../helper/common');
const { validator } = require('../helper');
const { isURL } = require('../helper');
const {md5} = require('../helper/crypto');

/**
 * oauth授权
 */
router.get('/', (req, res, ignore) => {
	const app = res.locals.app;
	let { redirect } = req.query;

	if(validator.empty(redirect)) {
		return res.failure('invalid_params');
	}

	redirect = decodeURIComponent(redirect);
	if(!isURL(redirect)) {
		return res.failure('invalid_redirecturl');
	}

	// set redirect into cache
    const shortRedirect = md5(redirect);
    if(!cache.get(shortRedirect)) {
        cache.set(`redirect:${shortRedirect}`, redirect);
    }

    const scope = req.query.scope || 'snsapi_userinfo';
    const state = app.id + '__wp__' + shortRedirect;
	const redirectURI = encodeURIComponent(`${setting.domain}/oauth/redirect`);
	// 用户同意授权，获取code
	res.redirect(`${setting.WP.AUTHORIZE}?appid=${app.wx_appid}&redirect_uri=${redirectURI}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`);
});


/**
 * 授权回调
 */
router.get('/redirect', async (req, res, next) => {
	let { state, code } = req.query;
	if(validator.empty(state) || validator.empty(code)) {
		return res.failure('invalid_params');
	}
	// state = decodeURIComponent(state);

	const tmp = state.split('__wp__');
	if(tmp.length !== 2) {
		return res.failure('invalid_state');
	}

	try {
		const appid = tmp[0];

		// get redirect from cache
        let redirect = cache.get(`redirect:${tmp[1]}`);
        if(!redirect) {
            return res.failure('redirect not found');
        }

		if(!redirect.includes('?')) {
			redirect += '?__wechat__=public';
		}

		const app = await getApp(appid);
		if(!app) {
			return res.failure('invalid_appid');
		}

		// 通过code换取网页授权access_token
		let body = await fetch.request({
            url: `${setting.WP.ACCESS_TOKEN}?appid=${app.wx_appid}&secret=${app.wx_appsecret}&code=${code}&grant_type=authorization_code`
        });
		body = body.data;
		if(body.errcode) {
			return res.failure(body.errmsg);
		}

		let { access_token, openid, scope, expires_in } = body;
		if(scope === 'snsapi_base') {
			// 如果scope == sns_apibase
			return res.redirect(`${redirect}&openid=${openid}`)
		} else {
			// 如果 scope == snsapi_userinfo，则获取用户基本信息
			body = await fetch.request({
                url: `${setting.WP.USERINFO}?access_token=${access_token}&openid=${openid}&lang=zh_CN`
            });
            body = body.data;
			if (body.errcode) {
				return res.failure(body.errmsg);
			}
			let {nickname, headimgurl, sex=1} = body;
			return res.redirect(`${redirect}&openid=${openid}&nickname=${nickname}&avatar=${headimgurl}&sex=${sex}&expire=${expires_in}`);
		}
	} catch (err) {
		next(err);
	}
});

module.exports = router;
