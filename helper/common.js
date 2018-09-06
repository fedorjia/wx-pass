const cache = require('./cache');
const App = require('../model/app');

/**
 * get app info
 */
exports.getApp = async (appid) => {
	// app info
    const key = `appid:${appid}`;
	let appinfo = cache.get(key);
	if (!appinfo) {
		const obj = await App.findById(appid);
		if (obj) {
			appinfo = { id: appid, wx_appid: obj.wx_appid, wx_appsecret: obj.wx_appsecret };
			cache.set(key, appinfo);
		}
	}
	return appinfo;
};
