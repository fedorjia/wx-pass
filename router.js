const express = require('express');
const router = express.Router();

router.use('/jsticket', require('./controller/jsticket'));
router.use('/oauth', require('./controller/oauth'));

module.exports = router;