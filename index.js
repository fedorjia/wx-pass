const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const util = require('util');
const path = require('path');

const app = express();
const mongodb = require('./helper/mongodb');
const router = require('./router');
const setting = require('./setting');
const authorize = require('./middleware/authorize');
const res = require('./middleware/res');
const logError = require('./helper/logerr');
const responseStatus = require('./error/response-status');


/***
 * globals
 */
global.mongo = {};
global.apps = {};

app.enable('trust proxy');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(helmet()); //  secure Express apps
app.set('trust proxy', 1);

// middleware
app.use(res);
app.use(authorize);

let staticPath = path.resolve(__dirname, './public');
/*static*/
app.use('/', express.static(staticPath, {maxAge: setting.staticMaxAge}));

// router
app.use(router);

/**
 * error handling
 */
app.use((err, req, res, ignore) => {
	if(typeof err === "string") {
		res.json({ status: responseStatus.SERVICE_EXCEPTION, body: err });
	} else {
		console.log(err);
		res.json({ status: responseStatus.INTERNAL_ERROR, body: '系统异常，请稍后再试' });
        // log error
        logError(req.originalUrl, null, err.message);
	}
});
app.use((req, res, ignore) => {
	res.json({ status: responseStatus.REQUEST_NOT_FOUND, body: '请求未找到' });
});

/**
 * connect mongodb
 */
mongodb.connect().then((db) => {
	global.mongo = db;
	app.listen(setting.port);
	console.log(setting.appname + ' launched at: ' + setting.port);
}).catch((err) => {
	console.error('connect mongodb error: ' + err.message);
});
