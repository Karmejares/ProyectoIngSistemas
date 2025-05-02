const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');

router.put('/update-time-limit', usersController.updateTimeLimit);
router.put('/update-privacy', usersController.updatePrivacy);
router.put('/change-password', usersController.changePassword);
router.delete('/delete-account', usersController.deleteAccount);

module.exports = router;
