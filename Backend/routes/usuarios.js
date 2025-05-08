const express = require('express');
const router = express.Router();
const {updateTimeLimit,changePassword,deleteAccount} = require('../controllers/userController');

router.put('/update-time-limit', updateTimeLimit);
router.put('/change-password', changePassword);
router.delete('/delete-account', deleteAccount);
//router.put('/update-privacy', updatePrivacy);

module.exports = router;
