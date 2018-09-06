const setting = require('../setting');
const { getApp } = require("../helper/common");
// const ENV = process.env.NODE_ENV;

const WHITE_RES = [
	'/favicon.ico',
    '/demo',
    '/oauth/redirect',
    '/MP_verify_XvX1Ji3koRlxiHqx.txt'
];

/**
 * authorization
 */
module.exports = async(req, res, next) => {
	const url = req.path;
	// white resources
	for(let item of WHITE_RES) {
		if(url.startsWith(item)) {
			return next();
		}
	}

	// app info
	const appid = req.query.appid;
	try {
        const appinfo = await getApp(appid);
        if (!appinfo) {
            return res.failure('invalid_appid');
        }
        res.locals.app = appinfo;
        return next();
    } catch (err) {
	    res.failure(err.message);
    }
};
