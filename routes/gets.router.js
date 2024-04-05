const express=require('express');
const router=express.Router();
const path = require('path');
const authenticateJWT=require('../controllers/jwt-auth')

const searchController=require('../controllers/search-controller')
const productsController=require('../controllers/product-controller')



router.get('/reset-password/:resetToken', (req, res) => {
    
    const root = path.join('./', 'view');
    // Render the HTML page for resetting password
    res.sendFile('reset-password.html', { root });
    
  });

// search route

router.get('/search', authenticateJWT, searchController.searchByUsername);
router.get('/products', authenticateJWT, productsController.getProducts);


module.exports=router;