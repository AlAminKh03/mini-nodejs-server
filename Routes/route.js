const express = require('express')
const router = express.Router()
const { randomUser, allUser, createUser, updateUser, bulkUpdate, deleteUser } = require('../Controllers/controllers')

router.get('/user/random', randomUser)
router.get('/user/all', allUser)
router.post('/user/save', createUser)
router.patch('/user/update', updateUser)
router.patch('/user/bulk-upadate', bulkUpdate)
router.delete('/user/delete', deleteUser)

module.exports = router