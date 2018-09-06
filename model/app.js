const ObjectID = require('mongodb').ObjectID;
const COLLECTION = 'apps';
const co = () => {
	return mongo.collection(COLLECTION);
};

module.exports = {

	async get(page, limit) {
		return await co().find()
			.skip((page - 1) * limit)
			.limit(limit)
			.sort({created_at: -1})
			.toArray();
	},

	async create(data) {
		data.created_at = new Date();
		return await co().save(data);
	},

	async findById(id) {
		return await co().findOne({_id: ObjectID(id)});
	}
};
