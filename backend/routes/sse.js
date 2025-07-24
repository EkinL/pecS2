const express = require('express')
const sse = require('../middleware/sse') // ton instance express-sse
const router = express.Router()
router.get('/', (req, res) => sse.init(req, res))
module.exports = router