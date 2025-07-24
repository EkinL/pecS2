const express   = require('express')
const router    = express.Router()

router.use('/auth', require('./auth'))
router.use('/users', require('./users'))
router.use('/payments', require('./payments'))
router.use('/admin', require('./admin'))

module.exports = router