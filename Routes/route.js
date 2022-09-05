const express = require('express')
const router = express.Router()
const { randomUser, allUser, createUser, updateUser } = require('../Controllers/controllers')

router.get('/user/random', randomUser)
router.get('/user/all', allUser)
router.post('/user/save', createUser)
router.patch('/user/update/:id', updateUser)

module.exports = router