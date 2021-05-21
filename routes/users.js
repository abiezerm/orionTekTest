const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');


router.get('/:email', userController.readUser);
router.get('/list', userController.readUser);
router.post('/', userController.createUser);
router.patch('/', userController.updateUser);
router.delete('/:email', userController.deleteUser);





module.exports = router;
