const format = require('util').format;
const setting = require('../setting');
const Promise = require("bluebird");
const mongodb = require("mongodb");

// promise mongo
Promise.promisifyAll(mongodb);

/***
 * connect db
 */
exports.connect = () => {
	return mongodb.MongoClient.connectAsync(format("mongodb://%s:%s/%s",
		setting.mongo.host,
		setting.mongo.port,
		setting.mongo.dbname));
};
