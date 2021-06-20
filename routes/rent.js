const express = require('express');
const router = express.Router();

const rents=require('../controllers/rents.js')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn,validateRent,isAuthor } = require('../middleware');
const multer  = require('multer')
const {storage}=require('../cloudinary');
const upload = multer({storage});



router.get('/', catchAsync(rents.index));
router.get('/new', isLoggedIn, rents.renderNewForm);
router.post('/', isLoggedIn, upload.array('image'),validateRent, catchAsync(rents.createRent));


router.get('/:id', catchAsync(rents.showRent));
router.get('/:id/edit', isLoggedIn,isAuthor, catchAsync(rents.renderEditForm))
router.put('/:id', isLoggedIn,isAuthor, upload.array('image'), validateRent , catchAsync(rents.updateRent))
router.delete('/:id', isLoggedIn,isAuthor, catchAsync(rents.deleteRent));
module.exports = router;