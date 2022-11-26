'use strict'

const router = require('express').Router();
const { check } = require('express-validator');
const { validateFields } = require('../../helpers/validateFields');
const { validateJWT } = require('../../middleware/validateJWT');
const { createUser, login, googleSingIn, getUserIfo } = require('./controller');

router.post('/signUp', [
    check('name','Name is required').not().isEmpty(),
    check('password','The password is mandatory and must contain more than 6 characters').isLength({min:6}),
    check('email','The email is not valid').isEmail(),
    validateFields
],createUser);

router.post('/login',[
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    validateFields
],login);

router.post('/google',[
    check('id_token', 'Google token is required').not().isEmpty(),
    validateFields
],googleSingIn);

router.get('/userInfo',[
    validateJWT,
    validateFields
],getUserIfo);

module.exports = router;
