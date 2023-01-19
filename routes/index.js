const router = require('express').Router();
const UsersController = require('../controllers/baseController');

router.post('/register', UsersController.createUser);
router.post('/createJWT', UsersController.createJWT);
router.get('/lists', UsersController.getList);
router.delete('/user', UsersController.deleteByPhone);
router.post('/verify', UsersController.verifyToken);

module.exports = router;
