const LRU = require('lru-cache');

const cache = new LRU({
	max: 500, // size
	maxAge: 3600000 // 1 hour
});

module.exports = cache;
