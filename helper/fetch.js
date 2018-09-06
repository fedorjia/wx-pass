const axios = require('axios');
const qs = require('querystring');

// const _isOutUrl = (url) => {
//     return url.startsWith("http");
// };

// const _body = (res) => {
//     if(res.status !== 200) {
//         throw '连接错误,status: ' + res.status;
//     } else {
//         const data = res.data;
//         if(data.status !== 200) {
//             throw data.body;
//         }
//         return data.body;
//     }
// } ;

module.exports = {

	async request(option) {
		return await axios(option);
	},

    async get(url, params = {}) {
        return await axios.get(url, { params: params });
    },

    async post(url, params = {}) {
        return await axios.post(url, qs.stringify(params));
    },

    async put(url, params = {}) {
        return await axios.put(url, qs.stringify(params));
    },

	async patch(url, params = {}) {
		return await axios.patch(url, qs.stringify(params));
	},

    async delete(url, params = {}) {
        return await axios.delete(url, qs.stringify(params));
    },

    async all(items) {
    	if(!Array.isArray(items)) {
    		throw 'fetch all must be array';
		}
		const task = [];
    	for(let item of items) {
    		task.push(axios(item));
		}
		let o = await axios.all(task);

    	let result = [];
    	for(let res of o) {
			result.push(res);
		}
        return result;
    }
};
