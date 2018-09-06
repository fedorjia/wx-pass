const isDev = process.env.NODE_ENV === 'development';

const setting = {
    appname: 't-wechat-public',
    port: 80, // 3003
    staticMaxAge: 86400000 * 7, // 7 days
    mongo : {
        host:"localhost",
        port: 27017,
        dbname: "t_wechat_public"
    },
    domain: 'http://wechat.shenzg.cn',
    proxyLogURL: 'http://localhost:3005', // err log

	WP: {
		AUTHORIZE: 'https://open.weixin.qq.com/connect/oauth2/authorize',
		ACCESS_TOKEN: 'https://api.weixin.qq.com/sns/oauth2/access_token',
    	USERINFO: 'https://api.weixin.qq.com/sns/userinfo',
		GETTICKET: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
        TOKEN: 'https://api.weixin.qq.com/cgi-bin/token'
	}
};


if(isDev) {
	setting.port = 80;
} else {
	setting.port = 3003;
}

module.exports = setting;
