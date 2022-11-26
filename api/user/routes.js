'use strict'

const router = require('express').Router();
const { check } = require('express-validator');
const { validateFields } = require('../../helpers/validateFields');
const { getInfoProfile } = require('./controller');

router.post('/login',[
    check('token', 'Token is required').isEmail(),
    validateFields
],getInfoProfile);

module.exports = router;
