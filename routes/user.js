const express = require('express');
const router = express.Router();
const passport=require('passport');
const catchAsync = require('../utils/catchAsync');
const users=require('../controllers/users')

router.get('/register',users.renderRegister);

router.post('/register',catchAsync(users.Register));


router.get('/login',users.renderLogin);

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.Login) 


router.get('/logout',users.Logout)

module.exports= router;